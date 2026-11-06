<template lang="html">
  <div class="">
    <vs-tabs>
      <vs-tab label="Usuarios">
        <div class="con-tab-ejemplo">
          <Usuario></Usuario>
        </div>
      </vs-tab>
      <vs-tab label="Cursos">
        <div class="con-tab-ejemplo">
         <Cursos></Cursos>
        </div>
      </vs-tab>
      <vs-tab label="Codigos Libros">
        <div class="con-tab-ejemplo">
          <Codigoslibros></Codigoslibros>
        </div>
      </vs-tab>
      <vs-tab label="Institucion">
        <div class="con-tab-ejemplo">
          <Institucion></Institucion>
        </div>
      </vs-tab>
      <vs-tab label="Temporadas">
        <div class="con-tab-ejemplo">
          <Temporada></Temporada>
        </div>
      </vs-tab>
    </vs-tabs>
  </div>
</template>

<script>
import Usuario from './tipos/UsuarioAudit'
import Cursos from './tipos/CursoAudit'
import Codigoslibros from './tipos/CodigosLibrosAudit'
import Institucion from './tipos/InstitucionAudit'
import  Temporada from './tipos/TemporadaAudit'
export default {
  data(){
    return{

    }
  },
  components:{
    Usuario,
    Cursos,
    Codigoslibros,
    Institucion,
    Temporada


  }
}
</script>