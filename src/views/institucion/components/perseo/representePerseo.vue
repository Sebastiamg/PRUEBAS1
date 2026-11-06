<template>
  <vx-card title="Perseo Clientes - Venta lista"
  >
    <div>
      <div class="vx-row">
        <div class="vx-col w-1/2">
          <small>Buscar Cliente por Cédula <b>Prolipa</b>:</small>
          <div class="flex">
            <vs-input v-model="busqueda.cedulaP" @keypress.enter="searchClientePerseo(1)" class="w-full" placeholder="Ingrese Cedula" />
            <!--boton buscar otro cliente-->
          </div>
        </div>
        <div class="vx-col w-1/2">
          <small>Buscar Cliente por Cédula <b>Calmed</b>:</small>
          <div class="flex">
            <vs-input v-model="busqueda.cedulaC" @keypress.enter="searchClientePerseo(3)" class="w-full" placeholder="Ingrese Cedula" />
            <!--boton buscar otro cliente-->
          </div>
        </div>
      </div>
      <!--seleccionados-->
      <div class="vx-row">
        <!--cliente prolipa-->
        <div class="vx-col w-1/2">
          <div v-if="datosSeleccionadoP.nombre">
            <vs-list>
              <vs-list-item icon="check" :title="'Cliente Seleccionado: '+datosSeleccionadoP.nombre" :subtitle="'Cédula: '+datosSeleccionadoP.cedula">
                <!--boton para quitar-->
                <vs-button @click="f_quitarClienteP()" class="ml-2 p-3" color="#D39C5E" type="filled" icon-pack="feather" icon="icon-x">Quitar Cliente</vs-button>
              </vs-list-item>
            </vs-list>
          </div>
          <div v-else>
            <vs-alert color="danger" icon="new_releases" class="mt-2">
              <vs-list>
                <vs-list-item  icon-pack="feather" icon="icon-alert-circle" color="primary" :title="'Cliente No seleccionado:'"></vs-list-item>
              </vs-list>
            </vs-alert>
          </div>
        </div>
        <!--cliente calmed-->
        <div class="vx-col w-1/2">
          <div v-if="datosSeleccionadoC.nombre">
            <vs-list>
              <vs-list-item icon="check" :title="'Cliente Seleccionado: '+datosSeleccionadoC.nombre" :subtitle="'Cédula: '+datosSeleccionadoC.cedula">
                <!--boton para quitar-->
                <vs-button @click="f_quitarClienteC()" class="ml-2 p-3" color="#D39C5E" type="filled" icon-pack="feather" icon="icon-x">Quitar Cliente</vs-button>
              </vs-list-item>
            </vs-list>
          </div>
          <div v-else>
            <vs-alert color="danger" icon="new_releases" class="mt-2">
              <vs-list>
                <vs-list-item  icon-pack="feather" icon="icon-alert-circle" color="primary" :title="'Cliente No seleccionado:'"></vs-list-item>
              </vs-list>
            </vs-alert>
          </div>
        </div>
      </div>
      <!--tablas-->
      <div class="vx-row mt-2">
        <!--tabla de busqueda cliente Prolipa-->
        <div :class="['vx-col', claseClienteP]">
          <vs-table max-items="10" search pagination :data="arrayClientesP" v-if="arrayClientesP.length > 0">
            <template slot="header">
              <vs-chip  color="primary">Cantidad: <b> {{ arrayClientesP.length }}</b></vs-chip>
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
                        <vs-button @click="Tipoempresa=1;f_selectCliente(data[indextr]);ObjectClientSelectedP=tr;" class="ml-2 p-3" color="primary" type="filled" icon-pack="feather" icon="icon-check">Seleccionar</vs-button>
                    </vs-td>
                </vs-tr>
            </template>
          </vs-table>
        </div>
         <!--tabla de busqueda cliente Calmed-->
         <div :class="['vx-col', claseClienteC]">
          <vs-table max-items="10" search pagination :data="arrayClientesC" v-if="arrayClientesC.length > 0">
            <template slot="header">
              <vs-chip  color="primary">Cantidad: <b> {{ arrayClientesC.length }}</b></vs-chip>
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
                        <vs-button @click="Tipoempresa=3;f_selectCliente(data[indextr]);ObjectClientSelectedC=tr;" class="ml-2 p-3" color="primary" type="filled" icon-pack="feather" icon="icon-check">Seleccionar</vs-button>
                    </vs-td>
                </vs-tr>
            </template>
          </vs-table>
        </div>
      </div>
    </div>
  </vx-card>
</template>
<script>
import ProformaRepository from '../../../../repositories/ProformaRepository';
export default {
  components:{
  },
  data() {
    return{
      usuario:[],
      datosInstitucion:'',
      busqueda:{
        cedulaP:'',
        cedulaC:'',
      },
      arrayClientesP:[],
      arrayClientesC:[],
      claseClienteP:'w-full',
      claseClienteC:'w-full',
      ObjectClientSelectedP:'',
      ObjectClientSelectedC:'',
      Tipoempresa:1,
      datosSeleccionadoP:{
        idusuario:'',
        nombre:'',
        cedula:'',
        email:'',
        clientesidPerseo:0,
      },
      datosSeleccionadoC:{
        idusuario:'',
        nombre:'',
        cedula:'',
        email:'',
        clientesidPerseo:0,
      },
    }
  },
  props:{
    id:{
      type:Number,
      default:0
    }
  },
  created(){
    let me = this
    me.usuario = JSON.parse(localStorage.getItem("usuario"))
  },
  mounted(){
    let me = this
    me.getDatosInstitucionPerseo()
  },
  methods:{
    getDatosInstitucionPerseo(){
      let me = this
      ProformaRepository.informacionInstitucionPerseo(me.id).then(response=>{
        me.datosInstitucion = response.data
        let datos = response.data
        if(datos.length == 0) return
        me.datosSeleccionadoP = {
          idusuario:         datos[0].idrepresentante_prolipa,
          nombre:            datos[0].clienteProlipa,
          cedula:            datos[0].cedulaProlipa,
          email:             datos[0].emailProlipa,
          clientesidPerseo:  datos[0].cliente_perseo_prolipa,
        }
        me.datosSeleccionadoC = {
          idusuario:         datos[0].idrepresentante_calmed,
          nombre:            datos[0].clienteCalmed,
          cedula:            datos[0].cedulaCalmed,
          email:             datos[0].emailCalmed,
          clientesidPerseo:  datos[0].cliente_perseo_calmed,
        }
      }).catch(error=>{
        console.log(error)
      })
    },
    searchClientePerseo(empresa){
      let me = this
      me.arrayClientes = []
      let formData = new FormData();
      formData.append("busqueda", empresa == 1 ? me.busqueda.cedulaP : me.busqueda.cedulaC);
      formData.append("empresa",  empresa);
      me.$vs.loading();
      this.$http
        .post(this.$server_url + "api/perseo/clientes/clientes_consulta", formData)
        .then((res) => {
          me.$vs.loading.close();
          if (res.data.fault) {
            this.$vs.notify({
              text: res.data.fault.faultstring,
              color: 'danger',
              iconPack: 'feather',
              icon: 'icon-check'
            });
            return;
          }
          if(empresa == 1){
            me.arrayClientesP = res.data.clientes
          }else{
            me.arrayClientesC = res.data.clientes
          }
          if(me.arrayClientesP.length > 0){
            me.claseClienteP = 'w-1/2'
            me.claseClienteC  = 'w-1/2'
          }else{
            me.claseClienteP = 'w-full'
            me.claseClienteC = 'w-full'
          }
        })
        .catch((error) => {
            console.log(error);
            me.$vs.loading.close();
            me.$vs.notify({
                text: "Error al buscar los datos",
                color: "danger",
                iconPack: "feather",
                icon: "icon-x",
            });
        });
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
          if(me.Tipoempresa == 1){
            me.sendClienteProlipa(datos[0])
          }else{
            me.sendClienteCalmed(datos[0])
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
    f_createUser(){
      let me = this
      let datos = ''
      //prolipa
      if(me.Tipoempresa == 1){
        datos = me.ObjectClientSelectedP
      }else{
        datos = me.ObjectClientSelectedC
      }
      var completo                        = datos.razonsocial
      var palabras                        = completo.split(" ");
      var primerasDosPalabras             = palabras.slice(0, 2).join(" ");
      var restantes                       = palabras.slice(2).join(" ");
      datos.apellidos                     = primerasDosPalabras;
      datos.nombres                       = restantes;
      let formData = new FormData();
      formData.append('crearUsuario', 1)
      formData.append('cedula',           datos.identificacion)
      formData.append('nombres',          datos.nombres)
      formData.append('apellidos',        datos.apellidos)
      formData.append('email',            datos.email)
      formData.append('id_grupo',         33)
      formData.append('institucion',      66)
      formData.append('user_created',     me.usuario.idusuario)
      formData.append('telefono',         0)
      me.$vs.loading()
      this.$http.post(this.$server_url+'pedidos2/pedidos', formData)
      .then(res => {
        let info = res.data
        me.$vs.loading.close()
        if(me.Tipoempresa == 1){
          me.sendClienteProlipa(info[0])
        }else{
          me.sendClienteCalmed(info[0])
        }
      })
      .catch(function (error) {
        console.log(error + ' error');
        me.$vs.loading.close()
        me.$vs.notify({
          title: 'Error',
          text: 'Error al guardar los datos',
          color: 'danger',
          iconPack: 'feather',
          icon: 'icon-alert-circle'
        })
      })
    },
    sendClienteProlipa(tr){
      let me = this
      me.datosSeleccionadoP.idusuario         = tr.idusuario
      me.datosSeleccionadoP.nombre            = tr.usuario
      me.datosSeleccionadoP.cedula            = tr.cedula
      me.datosSeleccionadoP.email             = tr.email
      me.datosSeleccionadoP.clientesidPerseo  = me.ObjectClientSelectedP.clientesid
      me.claseClienteP                        = 'w-full'
      me.claseClienteC                        = 'w-full'
      me.arrayClientesP                       = []
      me.updateClienteInstitucion(me.datosSeleccionadoP.clientesidPerseo,me.datosSeleccionadoP.idusuario,1)
      me.$emit('enviarDatosDespacho', me.datosSeleccionadoP)
    },
    sendClienteCalmed(tr){
      let me = this
      me.datosSeleccionadoC.idusuario          = tr.idusuario
      me.datosSeleccionadoC.nombre             = tr.usuario
      me.datosSeleccionadoC.cedula             = tr.cedula
      me.datosSeleccionadoC.email              = tr.email
      me.datosSeleccionadoC.clientesidPerseo   = me.ObjectClientSelectedC.clientesid
      me.claseClienteP                         = 'w-full'
      me.claseClienteC                         = 'w-full'
      me.arrayClientesC                        = []
      me.updateClienteInstitucion(me.datosSeleccionadoC.clientesidPerseo,me.datosSeleccionadoC.idusuario,3)
      me.$emit('enviarDatosDespacho', me.datosSeleccionadoC)
    },
    updateClienteInstitucion(clientePerseo,idusuario,empresa){
      let me = this
      let formData = new FormData();
      formData.append("clientePerseo", clientePerseo);
      formData.append("idusuario", idusuario);
      formData.append("empresa", empresa);
      formData.append("id_institucion", me.id);
      formData.append("updateClienteInstitucion", 1);
      me.$vs.loading();
      this.$http.post(this.$server_url+'pedidos2/pedidos', formData)
      .then(res => {
        me.$vs.loading.close()
        if(res.data.status == 0){
          me.$vs.notify({
            text:res.data.mensaje,
            color:'danger',
            iconPack: 'feather',
            icon:'icon-check'})
          return;
        }
        me.getDatosInstitucionPerseo()
        me.$vs.notify({
          text:'Cliente actualizado con exito',
          color:'success',
          iconPack: 'feather',
          icon:'icon-check'})
      })
      .catch(function (error) {
        console.log(error + ' error');
        me.$vs.loading.close()
        me.$vs.notify({
          title: 'Error',
          text: 'Error al guardar los datos',
          color: 'danger',
          iconPack: 'feather',
          icon: 'icon-alert-circle'
        })
      })
    },
    f_quitarClienteP(){
      let me = this
      me.datosSeleccionadoP.idusuario          = ''
      me.datosSeleccionadoP.nombre             = ''
      me.datosSeleccionadoP.cedula             = ''
      me.datosSeleccionadoP.email              = ''
      me.datosSeleccionadoP.clientesidPerseo   = 0
      me.updateClienteInstitucion(null,null,1)
      me.$emit('enviarDatosDespacho', me.datosSeleccionadoP)
    },
    f_quitarClienteC(){
      let me = this
      me.datosSeleccionadoC.idusuario          = ''
      me.datosSeleccionadoC.nombre             = ''
      me.datosSeleccionadoC.cedula             = ''
      me.datosSeleccionadoC.email              = ''
      me.datosSeleccionadoC.clientesidPerseo   = 0
      me.updateClienteInstitucion(null,null,3)
      me.$emit('enviarDatosDespacho', me.datosSeleccionadoC)
    },
  }
}
</script>

