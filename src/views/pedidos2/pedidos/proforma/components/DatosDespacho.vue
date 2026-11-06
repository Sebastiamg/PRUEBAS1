<template>
  <div>
    <div v-if="menu != 0">
      <!--boton regresar-->
      <vs-button @click="menu = 0" class="mb-2 p-2" color="primary">◄ Regresar</vs-button>
    </div>
    <div v-if="menu == 0">
      <vs-divider></vs-divider>
      <div class="vx-row">
        <!--datos librerias -->
        <div class="vx-col w-full sm:w-full md:w-1/2 lg:w-1/2 xl:w-1/2">
          <!--libreria-->
          <div class="vx-col w-full">
            <span>Buscar <b>PUNTO DE DESPACHO</b> <small>(Presionar enter para buscar)</small>:</span>
            <vs-input v-model="busqueda.puntoVenta" @keypress.enter="searchData(0)" class="w-full" placeholder="INGRESE EL PUNTO DE DESPACHO" />
          </div>
           <!--datos librerias -->
           <div v-if="datosSeleccionado.nombreInstitucion">
            <vs-list>
              <vs-list-item icon="check" :title="'Libreria Seleccionada: '+datosSeleccionado.nombreInstitucion" :subtitle="'Ciudad '+datosSeleccionado.ciudad">
                <div class="flex">
                  <!--boton para editar-->
                  <vs-button @click="institucion_id = datosSeleccionado.id_institucion;menu = 1" class="p-3" color="primary" type="filled" icon-pack="feather" icon="icon-edit">Editar</vs-button>
                  <!--boton para quitar-->
                  <vs-button @click="f_quitarPuntoVenta()" class="ml-2 p-3" color="#D39C5E" type="filled" icon-pack="feather" icon="icon-x">Quitar</vs-button>
                </div>
              </vs-list-item>
            </vs-list>
          </div>
          <div v-else>
            <vs-alert color="danger" icon="new_releases" >
              <vs-list>
                <vs-list-item  icon-pack="feather" icon="icon-alert-circle" color="primary" :title="'Libreria No seleccionada:'"></vs-list-item>
              </vs-list>
            </vs-alert>
          </div>
        </div>
        <!--datos cliente-->
        <div class="vx-col w-full sm:w-full md:w-1/2 lg:w-1/2 xl:w-1/2">
          <!--datos del cliente-->
          <div class="vx-col w-full">
            <span>Busqueda de Cliente en (<b>PERSEO</b>, <b>COBRANZA</b>):</span>

            <!-- Selector de tipo de búsqueda -->
            <div class="mb-2 mt-2">
              <div class="flex" style="gap: 1rem;">
                <vs-radio v-model="busqueda.tipoBusqueda" vs-value="identificacion" color="primary">
                  CI / RUC
                </vs-radio>
                <vs-radio v-model="busqueda.tipoBusqueda" vs-value="contenido" color="primary">
                  Nombre / Razón Social
                </vs-radio>
              </div>
            </div>

            <div class="flex">
              <vs-input
                v-model="busqueda.cedula"
                @keypress.enter="searchClientePerseo()"
                @input="busqueda.tipoBusqueda === 'identificacion' ? validateNumber() : null"
                class="w-full"
                :placeholder="busqueda.tipoBusqueda === 'identificacion'
                  ? 'Ingrese la cédula (10 dígitos) o RUC (13 dígitos) completo'
                  : 'Ingrese el nombre o razón social (mínimo 3 caracteres)'"
              />
            </div>
            <small class="block mt-1" :style="{color: validarLongitudCliente() ? '#6b7280' : '#ef4444'}">
              {{ obtenerMensajeValidacionCliente() }}
            </small>
          </div>
          <!--datos cliente-->
          <div v-if="datosSeleccionado.nombre">
            <vs-list>
              <vs-list-item icon="check" :title="'Cliente Seleccionado: '+datosSeleccionado.nombre" :subtitle="'Cédula: '+datosSeleccionado.cedula">
                <!--boton para quitar-->
                <vs-button @click="f_quitarCliente()" class="ml-2 p-3" color="#D39C5E" type="filled" icon-pack="feather" icon="icon-x">Quitar Cliente</vs-button>
              </vs-list-item>
            </vs-list>
          </div>
          <div v-else>
            <vs-alert color="danger" icon="new_releases" >
              <vs-list>
                <vs-list-item  icon-pack="feather" icon="icon-alert-circle" color="primary" :title="'Cliente No seleccionado:'"></vs-list-item>
              </vs-list>
            </vs-alert>
          </div>
        </div>
      </div>
      <div class="vx-row mt-2">
        <!--tabla de busqueda punto de venta-->
        <div :class="['vx-col', claseLibreria]">
          <vs-table max-items="10" search pagination stripe :data="arrayPuntoVenta" v-if="arrayPuntoVenta.length > 0">
            <template slot="header">
              <vs-chip  color="primary">Cantidad: <b> {{ arrayPuntoVenta.length }}</b></vs-chip>
            </template>
            <template slot="thead">
                <vs-th>Nombre</vs-th>
                <vs-th>Ciudad</vs-th>
                <vs-th>Acciones</vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td>
                      {{data[indextr].nombreInstitucion}}<br>
                      <div v-if="tr.datosInstitucion.length > 0">
                        <b>Crédito:</b>
                        <p>{{ tr.datosInstitucion[0].ffp_credito }}</p>
                        <b>Cupo:</b>
                        <p>{{ tr.datosInstitucion[0].ffp_cupo }}</p>
                        <b>Descuento:</b>
                        <p>{{ tr.datosInstitucion[0].ffp_descuento }}%</p>
                      </div>
                      <div v-else>
                        <!--no esta configurado el porcentaje del cupo y el porcentaje-->
                        <p class="text-danger">No está configurado el cupo y el porcentaje de descuento.</p>
                      </div>
                    </vs-td>
                    <vs-td>
                      {{data[indextr].ciudad}}<br>
                    </vs-td>
                    <vs-td>
                        <!--boton de seleccionar-->
                        <vs-button @click="f_selectPuntoVenta(data[indextr])" class="ml-2 p-3" color="primary" type="filled" icon-pack="feather" icon="icon-check">Seleccionar</vs-button>
                    </vs-td>
                </vs-tr>
            </template>
          </vs-table>
        </div>
        <!--tabla de busqueda cliente-->
        <div :class="['vx-col', claseCliente]">
          <vs-table max-items="10" search pagination :data="arrayClientes" v-if="arrayClientes.length > 0">
            <template slot="header">
              <vs-chip  color="primary">Cantidad: <b> {{ arrayClientes.length }}</b></vs-chip>
            </template>
            <template slot="thead">
                <vs-th>Nombre</vs-th>
                <vs-th>Cédula</vs-th>
                <vs-th>Acciones</vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td>
                      {{data[indextr].razonsocial}}<br>
                    </vs-td>
                    <vs-td>
                      {{data[indextr].identificacion}}<br>
                    </vs-td>
                    <vs-td>
                        <!--boton de seleccionar-->
                        <vs-button @click="f_selectCliente(data[indextr]);ObjectClientSelected=tr;" class="ml-2 p-3" color="primary" type="filled" icon-pack="feather" icon="icon-check">Seleccionar</vs-button>
                    </vs-td>
                </vs-tr>
            </template>
          </vs-table>
        </div>
      </div>
    </div>
    <!--editar la institucion-->
    <div v-if="menu == 1">
      <FacturacionInformacionInstitucionVue :institucion_id="institucion_id" @changeSaveInformacion="changeSaveInformacion"/>
    </div>
  </div>
</template>
<script>
import vSelect from 'vue-select';
const FacturacionInformacionInstitucionVue = () => import('./FacturacionInformacionInstitucion.vue');
export default {
  components:{
    vSelect,
    FacturacionInformacionInstitucionVue
  },
  data() {
    return{
      usuario:localStorage.usuario ? JSON.parse(localStorage.usuario) : {},
      arrayPuntoVenta:[],
      arrayClientes:[],
      arraySeleccionar:[],
      puntoSelected:'',
      clienteSelected:'',
      busqueda:{
        cedula:'',
        puntoVenta:'',
        tipoBusqueda: 'identificacion', // 'identificacion' o 'contenido'
      },
      claseLibreria:'w-full',
      claseCliente:'w-full',
      datosSeleccionado:{
        nombreInstitucion:'',
        ciudad:'',
        id_institucion:'',
        idusuario:'',
        nombre:'',
        cedula:'',
        email:'',
        datosInstitucion:[],
        clientesidPerseo:0,
      },
      menu:0,
      institucion_id:0,
      ObjectClientSelected:{
        identificacion:'',
        nombres:'',
        apellidos:'',
      },
    }
  },
  props:{
    //accionProforma  0 => nuevo; 1 => editar
    accionProforma:{
      type:Number,
      default:0
    },
    idProforma:{
      type: String,
      default: ""
    },
    id_periodo:{
      type:Number,
      default:0
    },
    empresa: {
      type: [Object, String],
      default: () => ({})
    },
    firstProforma:{
      type: [Object, String],
      default: () => ({})
    },
    ifFirstProforma:{
      type:Boolean,
      default:false,
    }
  },
  mounted(){
    let me = this
    me.start()
  },
  watch: {
    // Limpiar resultados cuando cambia el tipo de búsqueda
    'busqueda.tipoBusqueda'(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.busqueda.cedula = '';
        this.arrayClientes = [];
      }
    },
    // Limpiar resultados cuando se modifica o limpia el texto de búsqueda
    'busqueda.cedula'(newVal) {
      if (!newVal || newVal.trim() === '') {
        this.arrayClientes = [];
      }
    }
  },
  methods:{
    start(){
      let me = this
      // console.log("lobo2",me.firstProforma)
      if(me.accionProforma == 1){
        if(me.ifFirstProforma){
          me.datosSeleccionado = {
            nombreInstitucion: me.firstProforma.nombreInstitucion,
            ciudad:            me.firstProforma.ciudad,
            id_institucion:    me.firstProforma.id_ins_depacho,
            idusuario:         me.firstProforma.ven_cliente,
            nombre:            me.firstProforma.cliente,
            cedula:            me.firstProforma.ruc_cliente,
            email:             me.firstProforma.emailCliente,
            clientesidPerseo:  me.firstProforma.clientesidPerseo,
            datosInstitucion:  me.firstProforma.datosInstitucion
          }
          me.$emit('enviarDatosDespacho', me.datosSeleccionado)
        }else{
          console.log("lol2")
          me.getDatosDespacho()
        }
      }
    },
    getDatosDespacho(){
      let me = this
      if(me.idProforma == "" || me.idProforma == null || me.idProforma == undefined) return
      //api get
      this.$http.get(this.$server_url+`pedidos2/pedidos?getDatosDespachoProforma=1&idProforma=${me.idProforma}&id_periodo=${me.id_periodo}`)
        .then(function (res) {
          let datos = res.data
          if(datos.length == 0) return
          //cliente envia la proforma despues de la primera proforma
          me.datosSeleccionado = {
            nombreInstitucion: datos[0].nombreInstitucion,
            ciudad:            datos[0].ciudad,
            id_institucion:    datos[0].id_ins_depacho,
            idusuario:         datos[0].ven_cliente,
            nombre:            datos[0].cliente,
            cedula:            datos[0].cedula,
            email:             datos[0].email,
            clientesidPerseo:  datos[0].clientesidPerseo,
            datosInstitucion:  datos[0].datosInstitucion
          }
          me.$emit('enviarDatosDespacho', me.datosSeleccionado)
        })
        .catch(function (error) {
            console.log(error + ' error');
        })
    },
    searchData(tipo){
      //tipo 0 => punto de venta; tipo 1 => cliente
      let me = this
      var url = ""
      if(tipo == 0){
        //minimo 4 caracteres
        if(me.busqueda.puntoVenta.length < 4){
          me.$vs.notify({
            title: 'Error',
            text: 'Debe ingresar al menos 4 caracteres',
            color: 'danger',
            iconPack: 'feather',
            icon: 'icon-alert-circle'
          })
          return
        }
        url = 'pedidos2/pedidos?getDatosPuntosVenta=1&busqueda='+me.busqueda.puntoVenta+'&id_periodo='+me.id_periodo
        if(me.arrayClientes.length > 0){
          me.claseLibreria = 'w-1/2'
          me.claseCliente  = 'w-1/2'
        }else{
          me.claseLibreria = 'w-full'
          me.claseCliente = 'w-full'
        }
      }else{
        //minimo 3 caracteres
        if(me.busqueda.cedula.length < 3){
          me.$vs.notify({
            title: 'Error',
            text: 'Debe ingresar al menos 3 caracteres',
            color: 'danger',
            iconPack: 'feather',
            icon: 'icon-alert-circle'
          })
          return
        }
        url = 'pedidos2/pedidos?getDatosClientes=1&busqueda='+me.busqueda.cedula
        if(me.arrayPuntoVenta.length > 0){
          me.claseLibreria = 'w-1/2'
          me.claseCliente  = 'w-1/2'
        }else{
          me.claseLibreria = 'w-full'
          me.claseCliente = 'w-full'
        }
      }
      me.$vs.loading()
      this.$http.get(this.$server_url+url)
      .then(function (res) {
        me.$vs.loading.close()
        //tipo 0 => punto de venta; tipo 1 => cliente
        if(tipo == 0){
          me.arrayPuntoVenta = res.data
          if(me.arrayPuntoVenta.length == 0){
            me.$vs.notify({
              title: 'Error',
              text: 'No se encontraron datos',
              color: 'danger',
              iconPack: 'feather',
              icon: 'icon-alert-circle'
            })
          }
        }else{
          me.arrayClientes = res.data
          if(me.arrayClientes.length == 0){
            me.$vs.notify({
              title: 'Error',
              text: 'No se encontraron datos',
              color: 'danger',
              iconPack: 'feather',
              icon: 'icon-alert-circle'
            })
          }
        }
      })
      .catch(function (error) {
        console.log(error + ' error');
        me.$vs.loading.close()
        me.$vs.notify({
          title: 'Error',
          text: 'Error al buscar los datos',
          color: 'danger',
          iconPack: 'feather',
          icon: 'icon-alert-circle'
        })
      })
    },
    searchClientePerseo(){
      let me = this

      // Validar según el tipo de búsqueda
      if (!me.validarLongitudCliente()) {
        let mensaje = '';
        if (me.busqueda.tipoBusqueda === 'identificacion') {
          mensaje = 'Debe ingresar la cédula completa (10 dígitos) o RUC completo (13 dígitos)';
        } else {
          mensaje = 'Debe ingresar al menos 3 caracteres para buscar por nombre';
        }

        me.$vs.notify({
          title: 'Error de Validación',
          text: mensaje,
          color: 'danger',
          iconPack: 'feather',
          icon: 'icon-alert-circle'
        });
        return;
      }

      me.arrayClientes = []
      let formData = new FormData();

      // Enviar el parámetro correcto según el tipo de búsqueda seleccionado
      if (me.busqueda.tipoBusqueda === 'identificacion') {
        formData.append("identificacion", me.busqueda.cedula);
      } else {
        formData.append("contenido", me.busqueda.cedula);
      }

      formData.append("empresa",  me.empresa.id);
      me.$vs.loading();
      this.$http
          .post(this.$server_url + "api/perseo/clientes/clientes_consulta", formData)
          .then((res) => {
            me.$vs.loading.close();

            // Mostrar indicador de ambiente - solo envía el ID de la empresa
            // me.$store.dispatch('mostrarAmbienteEmpresa', me.empresa.id);

            if(!res.data){
              this.$vs.notify({
                text: me.busqueda.tipoBusqueda === 'identificacion'
                  ? 'No se encontró esta cédula o RUC en Perseo.'
                  : 'No se encontró este nombre en Perseo.',
                color: 'danger',
                iconPack: 'feather',
                icon: 'icon-alert-circle'
              });
              return;
            }
            if (res.data.fault) {
              this.$vs.notify({
                text: res.data.fault.faultstring,
                color: 'danger',
                iconPack: 'feather',
                icon: 'icon-alert-circle'
              });
              return;
            }
            me.arrayClientes = res.data.clientes

            if (me.arrayClientes.length === 0) {
              me.$vs.notify({
                title: 'Sin resultados',
                text: `No se encontraron clientes con ${me.busqueda.tipoBusqueda === 'identificacion' ? 'esa identificación' : 'ese nombre'} en Perseo`,
                color: 'warning',
                iconPack: 'feather',
                icon: 'icon-alert-triangle'
              });
            }

            if(me.arrayPuntoVenta.length > 0){
              me.claseLibreria = 'w-1/2'
              me.claseCliente  = 'w-1/2'
            }else{
              me.claseLibreria = 'w-full'
              me.claseCliente = 'w-full'
            }
          })
          .catch((error) => {
              console.log(error);
              me.$vs.loading.close();
              me.$vs.notify({
                  text: "Error al buscar los datos en Perseo",
                  color: "danger",
                  iconPack: "feather",
                  icon: "icon-x",
              });
          });
    },
    f_selectPuntoVenta(tr){
      let me = this
      me.datosSeleccionado.nombreInstitucion  = tr.nombreInstitucion
      me.datosSeleccionado.ciudad             = tr.ciudad
      me.datosSeleccionado.id_institucion     = tr.idInstitucion
      me.datosSeleccionado.datosInstitucion   = tr.datosInstitucion
      me.claseLibreria                        = 'w-full'
      me.claseCliente                         = 'w-full'
      me.arrayPuntoVenta                      = []
      me.$emit('enviarDatosDespacho', me.datosSeleccionado)
    },
    f_selectCliente(tr){
      let me = this
      var url = 'pedidos2/pedidos?getDatosClient=1&busqueda='+tr.identificacion
      this.$http.get(this.$server_url+url)
      .then(function (res) {
        let datos = res.data
        if(datos == 0){
         me.f_createUser(tr)
        }else{
          me.sendCliente(datos[0])
        }
      })
      .catch(function (error) {
        console.log(error + ' error');
        me.$vs.loading.close()
        me.$vs.notify({
          title: 'Error',
          text: 'Error al buscar los datos',
          color: 'danger',
          iconPack: 'feather',
          icon: 'icon-alert-circle'
        })
      })
    },
    f_createUser(){
      let me = this
      let completo = me.ObjectClientSelected.razonsocial.trim();
      let palabras = completo.split(/\s+/);

      let nombres = '';
      let apellidos = '';

      if (palabras.length >= 3) {
        // Caso de más de 2 apellidos y nombres
        apellidos = palabras.slice(0, 2).join(' ');
        nombres = palabras.slice(2).join(' ');
      } else if (palabras.length === 2) {
        // Caso de 1 apellido y 1 nombre
        apellidos = palabras[0];
        nombres = palabras[1];
      } else if (palabras.length === 1) {
        // Caso de solo nombre o empresa
        apellidos = palabras[0];
        nombres = palabras[0];
      } else {
        apellidos = completo;
        nombres = completo;
      }

      me.ObjectClientSelected.apellidos = apellidos;
      me.ObjectClientSelected.nombres = nombres;

      // 🔹 Limpiar emails pero conservar todos
      let emailRaw = me.ObjectClientSelected.email || '';
      let emailList = emailRaw
        .split(/[\r\n,;]+/)   // separar por salto de línea, coma o punto y coma
        .map(e => e.trim())
        .filter(e => e !== '');

      // 🔹 Volver a unirlos con coma o punto y coma (como prefieras)
      let emailsFinal = emailList.join('; ');

      let formData = new FormData();
      formData.append('crearUsuario', 1);
      formData.append('cedula', me.ObjectClientSelected.identificacion);
      formData.append('nombres', me.ObjectClientSelected.nombres);
      formData.append('apellidos', me.ObjectClientSelected.apellidos);
      formData.append('email', emailsFinal); // ✅ todos los emails
      formData.append('id_grupo', 33);
      formData.append('institucion', 66);
      formData.append('user_created', me.usuario.idusuario);
      formData.append('telefono', 0);

      me.$vs.loading();
      this.$http.post(this.$server_url + 'pedidos2/pedidos', formData)
        .then(res => {
          me.$vs.loading.close();
          me.sendCliente(res.data[0]);
        })
        .catch(error => {
          console.log(error + ' error');
          me.$vs.loading.close();
          me.$vs.notify({
            title: 'Error',
            text: 'Error al guardar los datos',
            color: 'danger',
            iconPack: 'feather',
            icon: 'icon-alert-circle'
          });
        });
    },
    sendCliente(tr){
      let me = this
      console.log("test",me.ObjectClientSelected)
      me.datosSeleccionado.idusuario          = tr.idusuario
      me.datosSeleccionado.nombre             = tr.usuario
      me.datosSeleccionado.cedula             = tr.cedula
      me.datosSeleccionado.email              = tr.email
      me.datosSeleccionado.clientesidPerseo   = me.ObjectClientSelected.clientesid
      me.claseLibreria                        = 'w-full'
      me.claseCliente                         = 'w-full'
      me.arrayClientes                        = []
      me.$emit('enviarDatosDespacho', me.datosSeleccionado)
    },
    f_quitarPuntoVenta(){
      let me = this
      me.datosSeleccionado.nombreInstitucion  = ''
      me.datosSeleccionado.ciudad             = ''
      me.datosSeleccionado.id_institucion     = ''
      me.datosSeleccionado.datosInstitucion   = []
      me.$emit('enviarDatosDespacho', me.datosSeleccionado)
    },
    f_quitarCliente(){
      let me = this
      me.datosSeleccionado.idusuario          = ''
      me.datosSeleccionado.nombre             = ''
      me.datosSeleccionado.cedula             = ''
      me.datosSeleccionado.email              = ''
      me.datosSeleccionado.clientesidPerseo   = 0
      me.$emit('enviarDatosDespacho', me.datosSeleccionado)
    },
    validateNumber() {
      // Solo validar números si la búsqueda es por identificación
      if (this.busqueda.tipoBusqueda === 'identificacion') {
        // Reemplaza cualquier carácter que no sea un número
        this.busqueda.cedula = this.busqueda.cedula.replace(/\D/g, '');
        // Limita el valor a 13 caracteres (para RUC)
        if (this.busqueda.cedula.length > 13) {
          this.busqueda.cedula = this.busqueda.cedula.slice(0, 13);
        }
      }
    },

    validarLongitudCliente() {
      if (this.busqueda.tipoBusqueda === 'identificacion') {
        // Para CI/RUC: debe tener entre 10 y 13 caracteres
        const longitud = this.busqueda.cedula.length;
        return longitud >= 10 && longitud <= 13;
      } else {
        // Para nombre: mínimo 3 caracteres
        return this.busqueda.cedula.length >= 3;
      }
    },

    obtenerMensajeValidacionCliente() {
      if (this.busqueda.tipoBusqueda === 'identificacion') {
        const longitud = this.busqueda.cedula.length;
        if (longitud === 0) {
          return 'Ingrese la cédula (10 dígitos) o RUC (13 dígitos) completo';
        } else if (longitud < 10) {
          return `Faltan ${10 - longitud} dígito(s). Cédula: 10 dígitos, RUC: 13 dígitos`;
        } else if (longitud === 10) {
          return '✓ Cédula completa (10 dígitos) - Presione Enter para buscar';
        } else if (longitud > 10 && longitud < 13) {
          return `Faltan ${13 - longitud} dígito(s) para RUC completo`;
        } else if (longitud === 13) {
          return '✓ RUC completo (13 dígitos) - Presione Enter para buscar';
        }
      } else {
        const longitud = this.busqueda.cedula.length;
        if (longitud === 0) {
          return 'Ingrese el nombre o razón social del cliente';
        } else if (longitud < 3) {
          return `Faltan ${3 - longitud} caracter(es). Mínimo 3 caracteres requeridos`;
        } else {
          return `✓ ${longitud} caracteres - Presione Enter para buscar`;
        }
      }
      return '';
    },
    changeSaveInformacion(e){
      let me = this
      me.menu = 0
    },
  }
}
</script>

<style scoped>
.mb-2 {
  margin-bottom: 0.5rem;
}

.mt-2 {
  margin-top: 0.5rem;
}

.mt-1 {
  margin-top: 0.25rem;
}

.block {
  display: block;
}
</style>
