<template>
    <vx-card
    v-if="usuario.id_group == 1 || usuario.id_group == 11  || usuario.id_group == 6"
    style="min-height: 100vh;"
    title="Gestión de códigos y pruebas de diagnóstico"
    title-color="primary"
    subtitle="Aqui podra ver cuantos códigos ha ingresado el estudiante y cuales son"
    >
      <div style="margin-top:-20px;" align="left" v-if="usuario.id_group != 6">
        <vs-divider></vs-divider>
        <small  v-if="usuario.id_group == 1" align="left">Ruta: /diagnostico/preguntas</small>
        <vs-list-header icon="supervisor_account" title="Seleccione una institución para filtrar los estudiantes"></vs-list-header>
        <TableSelectInstitucion @change="changeHandle" class="mt-1"/>
      </div>
      <div class="btn-group" style="margin-top: -40px;" v-if="usuario.id_group != 6">
        <vs-button @click="menu = 0;title='Filtro general'"><i class="fa-solid fa-filter"></i> Filtro general</vs-button>
        <vs-button @click="menu = 1;title='Filtro por materia'"><i class="fa-regular fa-file-lines"></i> Filtro por materia</vs-button>
      </div>
      <div class="btn-group" v-if="usuario.id_group == 6">
        <vs-button @click="menu = 0;title='Filtro general'"><i class="fa-solid fa-filter"></i> Filtro general</vs-button>
        <vs-button @click="menu = 1;title='Filtro por materia'"><i class="fa-regular fa-file-lines"></i> Filtro por materia</vs-button>
      </div>
      <vs-divider>{{ title }}</vs-divider>
      <div v-if="menu == 0">
        <TableUsuario :datosExportar="datosExportar" :arregloEstudiantes="arregloEstudiantes" :institucion_id="institucion_id" :periodo_id="periodo_id"/>
      </div>
      <div v-if="menu == 1">
        <div class="vx-row mb-6">
          <div class="vx-col sm:w-1/3 w-full">
            <span>Seleccione la materia</span>
          </div>
          <div class="vx-col sm:w-2/3 w-full">
            <v-select :options="libros" @input="verLibrosCodigosMateria()" :disabled="books" id="books" :reduce="libros => libros.idlibro" label="nombrelibro" class="w-full" v-model="txtlibro" />
          </div>
        </div>
        <TableMateria :arregloCodigos="arreglocodigosMateria"/>
      </div>
    </vx-card>
  </template>
  <script>
  import TableSelectInstitucion from '../../usuarios/GestionEstudiantes/components/TableSelectInstitucion.vue'
  import TableUsuario from './components/TableUsuario.vue'
  import TableMateria from './components/TableMateria.vue'
  import vSelect from 'vue-select'
  export default {
    components: {
      vSelect,
      TableSelectInstitucion,
      TableUsuario,
      TableMateria,
    },
    data () {
      return {
        changeInstitucion:false,
        institucion_id:0,
        error:false,
        statusPeriodo:0,
        periodo_id:0,
        arregloEstudiantes:[],
        libros:[],
        arreglocodigosMateria:[],
        datosExportar:[],
        menu:0,
        title:'Filtro general',
        txtlibro:'',
      }
    },
    created(){
      let me = this
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
      me.getLibros()
      if(me.usuario.id_group == 6) {
        me.institucion_id = me.usuario.institucion_idInstitucion
        me.periodo_id     = localStorage.periodo_id
      }
    },
    mounted(){
      let me = this;
      if(me.usuario.id_group == 6) me.getEstudiantes()
    },
    watch:{
      institucion_id(results){
        let me = this
        me.arregloEstudiantes = []
        me.datosExportar = []
        me.arreglocodigosMateria = []
        if(results > 0){
          this.getEstudiantes()
        }
      }
    },
    methods: {
      changeHandle(e){
        let me = this
        let valor = e.change
        if(valor == 'institucion')  me.institucion_id   = e.value
        if(valor == 'noPeriodo')    me.error            = e.value
        if(valor == 'periodo')      me.statusPeriodo    = e.value
        if(valor == 'periodo_id')   me.periodo_id       = e.value
        me.changeInstitucion = false
      },
      getLibros() {
        let me = this;
        var url = ""
        if(me.usuario.id_group == 6){
          url = this.$server_url + 'listaLibro?getLibrosDocente=yes&docente_id='+me.usuario.idusuario
        }else{
          url = this.$server_url + 'listaLibro'
        }
        this.$http.get(url)
          .then(function (res) {
            if(me.usuario.id_group == 6){
              me.libros = res.data.filter(p => p.periodo_id == localStorage.periodo_id)
              console.log("ee",me.libros)
            }else{
              me.libros = res.data.libros
            }
          })
          .catch(function (error) {
            console.log(error + ' error');
          })
      },
      getEstudiantes() {
        let me = this;
        me.$vs.loading();
        this.$http.get(this.$server_url+'gestionEstudiante?getEstudiantesInstitucion=yes&institucion_id='+me.institucion_id+'&periodo_id='+me.periodo_id)
        .then(function (res) {
          me.$vs.loading.close()
          me.arregloEstudiantes = res.data
          //GENERAR FORMATO PARA EXPORTAR
          me.arregloEstudiantes.forEach(element => {
            var cal = new Object();
            cal.estudiante                = element.estudiante
            cal.cedula                    = element.cedula
            cal.email                     = element.email
            cal.nombreInstitucion         = element.nombreInstitucion
            cal.contador                  = element.contador
            var contador = 1;
            for (let index = 0; index < element.codigos.length; index++) {
                try {
                  let valor = element.codigos[index].codigo
                  //cal.codigo[contador] = valor
                  eval("cal.codigo" + contador + "=" + 'valor');
                } catch (error) {
                  //cal.codigo[contador] = 0
                  eval("cal.codigo" + contador + "=" + 0);
                }
                contador++;
            }
            me.datosExportar.push(cal)
          });
        
        })
        .catch(function (error) {
          console.log(error + ' error');
          me.$vs.loading.close()
        })
      },
      verLibrosCodigosMateria(){
        let me = this;
        me.arreglocodigosMateria = []
        if(me.txtlibro == "" || me.txtlibro == undefined || me.txtlibro == undefined ){
          me.$vs.notify({
          text:'Debe seleccionar una materia para filtrar',
          color:'warning',
          iconPack: 'feather',
          icon:'icon-check'})
          return
        }
        me.$vs.loading();
        this.$http.get(this.$server_url+'gestionEstudiante?getEstudiantesxMateria=yes&institucion_id='+me.institucion_id+'&periodo_id='+me.periodo_id+'&libro_id='+me.txtlibro)
        .then(function (res) {
          me.$vs.loading.close()
          if(res.data.status == 0){
            me.$vs.notify({
            text:res.data.message,
            color:'warning',
            iconPack: 'feather',
            icon:'icon-check'})
          }
          me.arreglocodigosMateria = res.data

        })
        .catch(function (error) {
          console.log(error + ' error');
          me.$vs.loading.close()
        })
      },
    }
  }
  </script>
  
  <style scoped>
  </style>
  