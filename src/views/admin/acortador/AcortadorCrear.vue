<template>
  <div>
    <br><br>
    <div class="">
      <div class="vx-row mt-9">
        <div class="vx-col w-full">
          <p class="text-center title1">Acortador de link</p>
        </div>
      </div>
      <div class="vx-row">
        <div class="vx-col w-full sm:w-full md:w-5/6 xl:w-5/6 lg:w-5/6">
          <input type="text" class="link m-1" @keyup.enter="generateLink();" v-model="acortador.link_original" placeholder="Ingresar enlace">
        </div>
        <div class="vx-col w-full sm:w-full md:w-1/6 xl:w-1/6 lg:w-1/6">
          <vs-button icon-pack="feather" @click="generateLink();" icon="icon-scissors" class="w-full m-1 boton-cortar"> Cortar</vs-button>
        </div>
      </div>
      <!--opciones adicionales-->
      <div>
        <div>
          <ul class="flex">
            <li>
              <vs-button class="titulo2 mt-3" icon-pack="feather"  icon="icon-settings" type="flat">Opciones adicionales</vs-button>
            </li>
            <li class="mt-8 mr-3 ml-5" style="position:relative;">
              <vs-radio v-model="ifPersonalizado" @input="limpiar()" vs-name="radios1ifPersonalizado" vs-value="1">Si</vs-radio>
            </li>
            <li class="mt-8 mr-3" style="position:relative;">
              <vs-radio v-model="ifPersonalizado"  @input="limpiar()" vs-name="radios1ifPersonalizado" vs-value="0">No</vs-radio>
            </li>
          </ul>
        </div>
      </div>
      <div v-if="ifPersonalizado == 1">
        <div class="vx-row">
          <div class="vx-col w-full sm:w-full md:w-1/2 xl:w-1/2 lg:w-1/2">
            <div class="w-full p-2 bg-gray-400 text-center">
                <p class="font-mono  text-lg text-gray-800 text-center">
                    Área
                </p>
                <v-select @input="filtroLibros()" :options="areas" :reduce="areas => areas" label="nombrearea" class="w-full" v-model="acortador.area" />
            </div>
          </div>
          <div class="vx-col w-full sm:w-full md:w-1/2 xl:w-1/2 lg:w-1/2">
            <div class="w-full p-2 bg-gray-400 text-center">
              <p class="font-mono  text-lg text-gray-800 text-center">
               Libro
              </p>
              <v-select :options="arregloLibros" :reduce="arregloLibros => arregloLibros" label="nombrelibro" class="w-full" v-model="acortador.libro" />
            </div>
          </div>
        </div>
        <div class="vx-row">
          <div class="vx-col w-full sm:w-full md:w-1/2 xl:w-1/2 lg:w-1/2">
            <div class="w-full p-2 bg-gray-500 text-center">
                <p class="font-mono  text-lg text-gray-800 text-center">
                    Unidad
                </p>
                <v-select :options="unidades" :reduce="unidades => unidades" label="name" class="w-full" v-model="acortador.unidad" />
            </div>
          </div>
          <div class="vx-col w-full sm:w-full md:w-1/2 xl:w-1/2 lg:w-1/2">
            <div class="w-full p-2 bg-gray-400 text-center">
                <p class="font-mono  text-lg text-gray-800 text-center">
                  Página
                </p>
                <vs-input type="number" class="inputx w-full" placeholder="Pagina" v-model="acortador.pagina"/>
            </div>
          </div>
        </div>
      </div>
      <!--fin opciones adicionales-->
      <!--link generado-->
      <div class="vx-row link-generado" v-if="acortador.link_acortado">
        <div class="vx-col w-full sm:w-full md:w-5/6 xl:w-5/6 lg:w-5/6 my-2">
          <div>
            <div class="vx-row">
              <div class="vx-col w-full sm:w-full md:w-5/6 xl:w-5/6 lg:w-5/6">
                <input type="text" class="w-full link my-1" disabled v-model="acortador.link_acortado" placeholder="Link acortado">
              </div>
              <div class="vx-col w-full sm:w-full md:w-1/6 xl:w-1/6 lg:w-1/6">
                <vs-button icon-pack="feather" @click="copiarLink();" icon="icon-copy" class="boton-copiar my-1 w-full"> Copiar</vs-button>
              </div>
            </div>
            <!--input y un span que salgan unidos en un label para tener ambos agrupados-->
            <!-- <label class="flex" style="flex-wrap:wrap;">
              <input type="text" class="link my-1" disabled v-model="acortador.link_acortado" placeholder="Link acortado">
              <vs-button icon-pack="feather" @click="copiarLink();" icon="icon-copy" class="boton-copiar my-1"> Copiar</vs-button>
            </label> -->
          </div>
        </div>
        <!--QR-->
        <div class="vx-col w-full sm:w-full md:w-1/6 xl:w-1/6 lg:w-1/6 my-2">
          <img :src="'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data='+acortador.link_acortado" alt="QR" class="w-full">
        </div>
      </div>
    </div>
    <br><br><br><br><br><br><br><br><br><br>
  </div>
</template>
<script>
import vSelect from 'vue-select'
export default {
  components: {
    vSelect,
  },
  data() {
    return{
      acortador:{
        libro:'',
        unidad:'',
        pagina:'',
        link_original:'',
        link_acortado:'',
        area:'',
      },
      unidades:[
        {id:"1","name":"Unidad 1"},
        {id:"2" ,"name":"Unidad 2"},
        {id:"3" ,"name":"Unidad 3"},
        {id:"4" ,"name":"Unidad 4"},
        {id:"5" ,"name":"Unidad 5"},
        {id:"6" ,"name":"Unidad 6"},
        {id:"7" ,"name":"Unidad 7"},
        {id:"8" ,"name":"Unidad 8"},
      ],
      arregloLibros:[],
      areas:[],
      usuario:[],
      ifPersonalizado: 0,
      id: 0,
    }
  },
  created() {
    this.usuario = JSON.parse(localStorage.getItem('usuario'))
  },
  mounted() {
    this.getAreas()
  },
  methods:{
    getAreas() {
      let me = this;
      this.$http.get(this.$server_url+'areas')
        .then(function (res) {
          me.areas = res.data.area
          //solo con estado 1
          me.areas = me.areas.filter(function (area) {
              return area.estado == 1;
          });
          //por nombre ascendente la propiedad nombrearea
          me.areas.sort(function (a, b) {
            if (a.nombrearea > b.nombrearea) {
                return 1;
            }
            if (a.nombrearea < b.nombrearea) {
                return -1;
            }
            return 0;
          });
          //excluir idarea 83
          me.areas = me.areas.filter(function (area) {
            return area.idarea != 83;
          });
        })
        .catch(function (error) {
            console.log(error + ' error');
        })
    },
    filtroLibros(){
      let me = this
      me.acortador.libro = ""
      if(me.acortador.area == null || me.acortador.area == "" || me.acortador.area == undefined){
        return
      }
      me.$vs.loading();
      this.$http.get(this.$server_url+'filtroLibros?area='+me.acortador.area.idarea).then(res => {
        me.$vs.loading.close();
        me.arregloLibros = res.data;
        })
        .catch(function (error) {
        me.$vs.loading.close();
        console.log(error)
        })
    },
    generateLink(){
      let me = this;
      if(me.acortador.link_original.trim() == ""){
        me.$vs.notify({
          text: "Tiene que escribir un link",
          color: 'warning',
          iconPack: 'feather',
          icon: 'icon-alert-triangle'
        })
        return
      }
      //validar si es personalizado
      if(me.ifPersonalizado == 1){
        if(me.acortador.area == undefined || me.acortador.area == "" || me.acortador.area == null){
          me.$vs.notify({
            text: "Tiene que seleccionar un area",
            color: 'warning',
            iconPack: 'feather',
            icon: 'icon-alert-triangle'
          })
          return
        }
        if(me.acortador.libro == undefined || me.acortador.libro == "" || me.acortador.libro == null){
          me.$vs.notify({
            text: "Tiene que seleccionar un libro",
            color: 'warning',
            iconPack: 'feather',
            icon: 'icon-alert-triangle'
          })
          return
        }
        if(me.acortador.pagina == undefined || me.acortador.pagina == "" || me.acortador.pagina == null){
          me.$vs.notify({
            text: "Tiene que seleccionar una pagina",
            color: 'warning',
            iconPack: 'feather',
            icon: 'icon-alert-triangle'
          })
          return
        }
        if(me.acortador.unidad == undefined || me.acortador.unidad == "" || me.acortador.unidad == null){
          me.$vs.notify({
            text: "Tiene que seleccionar una unidad",
            color: 'warning',
            iconPack: 'feather',
            icon: 'icon-alert-triangle'
          })
          return
        }
      }
      else{
        me.acortador.area = ""
        me.acortador.libro = ""
        me.acortador.unidad = ""
        me.acortador.pagina = ""
      }
      let formData = new FormData()
      formData.append('id',           me.id)
      formData.append('area_id',      me.acortador.area.idarea == undefined ? 0 : me.acortador.area.idarea)
      formData.append('libro_id',     me.acortador.libro.idlibro == undefined ? 0 : me.acortador.libro.idlibro)
      formData.append('unidad',       me.acortador.unidad.id == undefined ? 0 : me.acortador.unidad.id)
      formData.append('pagina',       me.acortador.pagina == undefined ? 0 : me.acortador.pagina)
      formData.append('link_original',me.acortador.link_original)
      formData.append('link_acortado',me.acortador.link_acortado)
      formData.append('idusuario',    me.usuario.idusuario)
      me.$vs.loading();
      this.$http.post(this.$server_url+'l_', formData)
      .then(res => {
      me.$vs.loading.close()
      let ruta = res.data
      me.acortador.link_acortado = ruta
      var aux = document.createElement("input");
      aux.setAttribute("value", ruta);
      document.body.appendChild(aux);
      aux.select();
      try {
          var status = document.execCommand('copy');
          if (!status) {
              me.$vs.notify({ text: 'Error al copiar el link', color: 'warning', iconPack: 'feather', icon: 'icon-alert-triangle' })
          } else {
              me.$vs.notify({ text: 'Link copiado', color: 'success', iconPack: 'feather', icon: 'icon-check' })
          }
      } catch (err) {
          console.log('No se pudo copiar');
      }
      document.body.removeChild(aux);
      })
      .catch(function (error) {
          me.$vs.loading.close()
          console.log(error);
      })
    },
    copiarLink(){
      let me = this;
      let ruta = me.acortador.link_acortado
      var aux = document.createElement("input");
      aux.setAttribute("value", ruta);
      document.body.appendChild(aux);
      aux.select();
      try {
        var status = document.execCommand('copy');
        if (!status) {
            me.$vs.notify({ text: 'Error al copiar el link', color: 'warning', iconPack: 'feather', icon: 'icon-alert-triangle' })
        } else {
            me.$vs.notify({ text: 'Link copiado', color: 'success', iconPack: 'feather', icon: 'icon-check' })
        }
      } catch (err) {
          console.log('No se pudo copiar');
      }
      document.body.removeChild(aux);
    },
    limpiar(){
      this.acortador.link_acortado = ""
    },
  }
}
</script>
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap');
/*usar para todos la fuente   font-family: "Open Sans", sans-serif;
*/
* {
  font-family: "Open Sans", sans-serif;
}
/*estilo para el titulo de la pagina*/
.title1 {
  font-size: 54px;
  font-weight: 600;
  color: #333;
  margin: 20px 0;
}
.titulo2 {
  font-size: 22px;
  font-weight: 550;
  color: #2591ae;
}
/*estilo para el input llamado link con el border color azul y un padding*/
.link {
  border: 1px solid #dde0e2;
  padding:25px!important;
  border-radius: 5px;
  width: 100%!important;
}
/*estilos al placeholder de .link*/
.link::placeholder {
  color: #beb9b9;
  letter-spacing: 3px;
  font-weight: 200;
  font-size: 20px;
}
.boton-cortar {
  background-color: #ff8e88!important;
  border-color:#ff8e88!important;
  border: none!important;
  color: white!important;
  padding: 20px 20px!important;
  font-weight: bold!important;
  font-size: 21px!important;
}
/*estilo para el link generado*/
.link-generado {
  border: 1px dotted #2591ae;
  padding: 20px!important;
  border-radius: 5px;
  width: 99%;
  margin-left: 10px;
}
/*estilo para el boton copiar*/
.boton-copiar {
  background-color: #2591ae!important;
  border-color:#2591ae!important;
  border: none!important;
  color: white!important;
  padding: 20px 20px!important;
  font-weight: bold!important;
  font-size: 21px!important;
}
/*RESPONSIVE*/
/*boton-copiarA LOS 500px debe tener un 100% de ancho*/
@media (max-width: 500px) {
  .link-generado {
   padding: 0px!important;
  }
  .boton-copiar {
    width: 100%!important;
    margin-top: 5px!important;
  }
}
</style>

