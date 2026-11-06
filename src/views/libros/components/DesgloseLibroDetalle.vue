<template>
  <div>
    <div v-if="libros.length > 0" class="vx-row w-full">
      <!--LIBRO WEB-->
      <div class="padre vx-col w-full sm:1/2 md:w-1/5 xl:w-1/5" @click="datosStorage(libros[0]);datolibro(libros[0])">
        <img v-bind:src="$data_url+'archivos/upload/libro/'+libros[0].weblibro+'/'+libros[0].portada" alt="Imagen de fondo" class="imagen">
        <div class="hijo">
          <div class="letrac" >
            <p class="font-bold">Libro Web</p>
            <p>Sin respuestas</p>
          </div>
        </div>
      </div>
      <!--LIBRO WEB CON GUIA-->
      <div class="padre vx-col w-full sm:1/2 md:w-1/5 xl:w-1/5" @click="datosStorage(libros[0]);datolibro_guia(libros[0])" v-if="libros[0].weblibro_guia !== null && libros[0].weblibro_guia !== '' && libros[0].weblibro_guia !== 'null'">
        <img v-bind:src="$data_url+'archivos/upload/libro_guia/'+libros[0].weblibro_guia+'/'+libros[0].portada" alt="Imagen de fondo" class="imagen">
        <div class="hijo">
          <div class="letrac" >
            <p class="font-bold">Libro Web</p>
            <p>Con respuestas</p>
          </div>
        </div>
      </div>
      <!--PDF CON GUIA - Solo mostrar si NO existe weblibro_guia-->
      <div class="padre vx-col w-full sm:1/2 md:w-1/5 xl:w-1/5" @click="datosStorage(libros[0]);datopdfconguia(libros[0])" v-if="(libros[0].weblibro_guia === null || libros[0].weblibro_guia === '' || libros[0].weblibro_guia === 'null') && (libros[0].pdfconguia !== null && libros[0].pdfconguia !== '' && libros[0].pdfconguia !== 'null')">
        <img v-bind:src="$data_url+'archivos/upload/desglose_libros/img_pdf2.png'" alt="Imagen de fondo" class="imagen">
        <div class="hijo">
          <div class="letrac" >
            <p class="font-bold">PDF</p>
            <p>Con guía</p>
          </div>
        </div>
      </div>
      <!--LIBRO GUIA-->
      <!-- <div class="padre vx-col w-full sm:1/2 md:w-1/5 xl:w-1/5" @click="datosStorage(libros[0]);datopdfconguia(libros[0])" v-if="libros[0].pdfconguia!== null && libros[0].pdfconguia!== '' && libros[0].pdfconguia!== 'null'">
        <img v-bind:src="$data_url+'archivos/upload/desglose_libros/img_pdf2.png'" alt="Imagen de fondo" class="imagen">
        <div class="hijo">
          <div class="letrac" >
            <p class="font-bold">PDF</p>
            <p>Con guía</p>
          </div>
        </div>
      </div> -->
      <!--GUIA DIDACTICA-->
      <div class="padre vx-col w-full sm:1/2 md:w-1/5 xl:w-1/5" @click="datosStorage(libros[0]);datopdfguiadidactica(libros[0])" v-if="libros[0].id_serie !== 6 && libros[0].guiadidactica!== null && libros[0].guiadidactica!== '' && libros[0].guiadidactica!== 'null'">
        <img v-bind:src="$data_url+'archivos/upload/desglose_libros/img_pdf1.png'" alt="Imagen de fondo" class="imagen">
        <div class="hijo">
          <div class="letrac" >
            <p class="font-bold">Guía</p>
            <p>Didáctica</p>
          </div>
        </div>
      </div>
      <!--UNIDADES-->
      <template v-for="(item) in unidadesLibro">
        <div class="padre w-full sm:1/2 md:w-1/5 xl:w-1/5" @click="datosStorage(libros[0]);iractividades(item)">
          <img style="width: 100%;" class="imagen" v-bind:src="$data_url+'archivos/upload/libro/'+item.weblibro+'/portadas/unidad'+item.unidad+'.jpg'" alt="Imagen de fondo">
          <div class="hijo">
            <div class="letrac" >
              <p class="font-bold">
                <span v-if="item.txt_nombre_unidad == '' || item.txt_nombre_unidad == 'null' || item.txt_nombre_unidad === null">
                Unidad
                </span>
                <span v-else>
                {{item.txt_nombre_unidad}}
                </span>
                {{item.unidad}}
              </p>
              <small>
                  {{item.nombre_unidad}}
              </small>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
import historicoMixin from "@/mixins/historicomix";
export default{
  mixins:[historicoMixin],
  data(){
    return{
      usuario:[],
      miusuario: '',
      grupo_usuario: '',
    }
  },
  props:{
    unidadesLibro:{
      type:Array,
      default:function(){
        return []
      }
    },
    libros:{
      type:Array,
      default:function(){
        return []
      }
    },
  },
  created(){
    let me = this
    me.usuario = JSON.parse(localStorage.getItem('usuario'));
    me.miusuario = me.usuario;
    me.grupo_usuario = me.miusuario.id_group;
  },
  methods:{
    datosStorage(url){
      let me = this
      localStorage.nombrelibroSelec = url.nombrelibro
      localStorage.carpetaLibroSelec = url.weblibro
    },
    datolibro(url) {
      let me = this;
      localStorage.url = url.weblibro;
      for (let index = 0; index < me.unidadesLibro.length; index++) {
          if (index == 0) {
              localStorage.pag_inicio = me.unidadesLibro[index].pag_inicio
          }
          localStorage.pag_fin = me.unidadesLibro[index].pag_fin

      }
      let h_idinstitucion = me.miusuario.institucion_idInstitucion;
      let h_idusuario = me.miusuario.idusuario;
      let h_idgrupo = me.miusuario.id_group;
      let h_idasignatura = url.idasignatura
      let h_nombreasignatura = url.nombreasignatura
      let h_recursotipo = 1; //1 = libro
      let datoHistorico = {
          'user_nombre': me.miusuario.nombres,
          'user_apellido': me.miusuario.apellidos,
          'user_email': me.miusuario.email,
          'user_cedula': me.miusuario.cedula,
          'recurso_accion': 'ver',
          'recurso_tipo': 'libro',
          'recurso_nombre': url.nombrelibro,
          'recurso_detalle': 'libro completo',
      }
      // console.log(h_idinstitucion, h_idusuario, h_idgrupo, h_idasignatura, h_nombreasignatura, h_recursotipo,datoHistorico)
      me.historicoVisitas(h_idinstitucion, h_idusuario, h_idgrupo, h_idasignatura, h_nombreasignatura, h_recursotipo, datoHistorico);
      me.saveHistoricoVisitas(h_idinstitucion, h_idusuario, h_idgrupo, h_idasignatura,h_nombreasignatura,  h_recursotipo,datoHistorico)
      localStorage.vistalibro = 'por_unidad'
      // this.$router.push('/docente/libro/digital');
      let route = this.$router.resolve({
          path: '/docente/libro/digital'
      });

      window.open(route.href, '_blank');
    },
    datolibro_guia(url) {
      let me = this;
      // Guardar la carpeta de weblibro_guia para que digital.vue la use
      localStorage.url_guiaweb = url.weblibro_guia;
      localStorage.url = url.weblibro_guia; // También actualizar url principal

      // Calcular el rango de paginas de la guia a partir de ESTE componente
      // (me.unidadesLibro es el prop recibido: son las unidades del folleto
      // cuando este componente se renderiza dentro de la seccion "Folletos",
      // o las del libro grande cuando se renderiza en la seccion "Libro").
      // Antes esto se dejaba en manos de un calculo global hecho en
      // desgloselibro.vue para el LIBRO GRANDE, y ese mismo localStorage se
      // reusaba aqui sin recalcular -> al abrir la guia de un folleto se
      // terminaba usando el rango de paginas del libro grande completo.
      let minPagInicioGuia = null
      let maxPagFinGuia = null
      let hasGuiaPages = false

      for (let i = 0; i < me.unidadesLibro.length; i++) {
          const unidad = me.unidadesLibro[i]

          if (unidad.pag_inicio_guia !== null && unidad.pag_inicio_guia !== 'null' &&
              unidad.pag_fin_guia !== null && unidad.pag_fin_guia !== 'null') {
              hasGuiaPages = true

              if (minPagInicioGuia === null || unidad.pag_inicio_guia < minPagInicioGuia) {
                  minPagInicioGuia = unidad.pag_inicio_guia
              }
              if (maxPagFinGuia === null || unidad.pag_fin_guia > maxPagFinGuia) {
                  maxPagFinGuia = unidad.pag_fin_guia
              }
          }
      }

      if (!hasGuiaPages && me.unidadesLibro.length > 0) {
          minPagInicioGuia = me.unidadesLibro[0].pag_inicio
          for (let i = 0; i < me.unidadesLibro.length; i++) {
              maxPagFinGuia = me.unidadesLibro[i].pag_fin
          }
      }

      localStorage.pag_inicio_guia = minPagInicioGuia
      localStorage.pag_fin_guia = maxPagFinGuia

      let h_idinstitucion = me.miusuario.institucion_idInstitucion;
      let h_idusuario = me.miusuario.idusuario;
      let h_idgrupo = me.miusuario.id_group;
      let h_idasignatura = url.idasignatura
      let h_nombreasignatura = url.nombreasignatura
      let h_recursotipo = 1; //1 = libro
      let datoHistorico = {
          'user_nombre': me.miusuario.nombres,
          'user_apellido': me.miusuario.apellidos,
          'user_email': me.miusuario.email,
          'user_cedula': me.miusuario.cedula,
          'recurso_accion': 'ver',
          'recurso_tipo': 'libro con guía',
          'recurso_nombre': url.nombrelibro,
          'recurso_detalle': 'libro completo con guía',
      }
      me.historicoVisitas(h_idinstitucion, h_idusuario, h_idgrupo, h_idasignatura, h_nombreasignatura, h_recursotipo, datoHistorico);
      me.saveHistoricoVisitas(h_idinstitucion, h_idusuario, h_idgrupo, h_idasignatura,h_nombreasignatura,  h_recursotipo,datoHistorico)
      localStorage.vistalibro = 'por_unidad_guia'
      let route = this.$router.resolve({
          path: '/docente/libro/digital'
      });

      window.open(route.href, '_blank');
    },
    datopdfconguia(url) {
      let me = this
      // console.log(url)
      // return
      if (me.grupo_usuario == 9) {
          this.$vs.notify({
              text: 'El archivo no esta disponible en la version DEMO',
              color: 'warning',
              iconPack: 'feather',
              icon: 'icon-alert-triangle'
          })
          return
      }
      if (url.pdfconguia === null || url.pdfconguia === 'null') {
          me.$vs.notify({
              text: 'El PDF con guía aun no está disponible',
              color: 'warning',
              iconPack: 'feather',
              icon: 'icon-alert-triangle'
          })
          return
      }
      let h_idinstitucion = me.miusuario.institucion_idInstitucion;
      let h_idusuario = me.miusuario.idusuario;
      let h_idgrupo = me.miusuario.id_group;
      let h_idasignatura = url.idasignatura
      let h_nombreasignatura = url.nombreasignatura
      let h_recursotipo = 12; //12 = pdf con guia
      let datoHistorico = {
          'user_nombre': me.miusuario.nombres,
          'user_apellido': me.miusuario.apellidos,
          'user_email': me.miusuario.email,
          'user_cedula': me.miusuario.cedula,
          'recurso_accion': 'ver',
          'recurso_tipo': 'pdf con guia',
          'recurso_nombre': url.pdfconguia,
          'recurso_detalle': 'libro pdf guia',
      }
      // console.log(h_idinstitucion, h_idusuario, h_idgrupo, h_idasignatura, h_nombreasignatura, h_recursotipo,datoHistorico)
      me.historicoVisitas(h_idinstitucion, h_idusuario, h_idgrupo, h_idasignatura, h_nombreasignatura, h_recursotipo, datoHistorico);
      me.saveHistoricoVisitas(h_idinstitucion, h_idusuario, h_idgrupo, h_idasignatura,h_nombreasignatura,  h_recursotipo,datoHistorico)
      localStorage.url_guia = url.pdfconguia;
      window.open('/docente/libro/pdfconguia', '_blank');
    },
    datopdfguiadidactica(url) {
      let me = this
      if (me.grupo_usuario == 9) {
        this.$vs.notify({
            text: 'El archivo no esta disponible en la version DEMO',
            color: 'warning',
            iconPack: 'feather',
            icon: 'icon-alert-triangle'
        })
        return
      }
      if (url.guiadidactica === null || url.guiadidactica === 'null') {
        me.$vs.notify({
            text: 'La guía didáctica aun no está disponible',
            color: 'warning',
            iconPack: 'feather',
            icon: 'icon-alert-triangle'
        })
        return
      }

      let h_idinstitucion = me.miusuario.institucion_idInstitucion;
      let h_idusuario = me.miusuario.idusuario;
      let h_idgrupo = me.miusuario.id_group;
      let h_idasignatura = url.idasignatura
      let h_nombreasignatura = url.nombreasignatura
      let h_recursotipo = 14; //12 = guia didactica
      let datoHistorico = {
          'user_nombre': me.miusuario.nombres,
          'user_apellido': me.miusuario.apellidos,
          'user_email': me.miusuario.email,
          'user_cedula': me.miusuario.cedula,
          'recurso_accion': 'ver',
          'recurso_tipo': 'guia didactica',
          'recurso_nombre': url.guiadidactica,
          'recurso_detalle': '',
      }
      // console.log(h_idinstitucion, h_idusuario, h_idgrupo, h_idasignatura, h_nombreasignatura, h_recursotipo,datoHistorico)
      me.historicoVisitas(h_idinstitucion, h_idusuario, h_idgrupo, h_idasignatura, h_nombreasignatura, h_recursotipo, datoHistorico);
      me.saveHistoricoVisitas(h_idinstitucion, h_idusuario, h_idgrupo, h_idasignatura,h_nombreasignatura,  h_recursotipo,datoHistorico)
      localStorage.url_guiadid = url.guiadidactica;
      window.open('/docente/libro/pdfguiadidactica', '_blank');
    },
    iractividades(item) {
      let me = this;
      localStorage.url = item.weblibro
      // Guardar también weblibro_guia si existe para uso en unidades
      if (me.libros && me.libros.length > 0 && me.libros[0].weblibro_guia) {
        localStorage.url_guiaweb = me.libros[0].weblibro_guia
      }
      localStorage.indexUnidad = item.unidad
      localStorage.valUnidad = item.unidad
      localStorage.idUnidad = item.id_unidad_libro
      localStorage.pag_inicio = item.pag_inicio
      localStorage.pag_fin = item.pag_fin
      localStorage.pag_inicio_guia = item.pag_inicio_guia
      localStorage.pag_fin_guia = item.pag_fin_guia

      let h_idinstitucion = me.miusuario.institucion_idInstitucion;
      let h_idusuario = me.miusuario.idusuario;
      let h_idgrupo = me.miusuario.id_group;
      let h_idasignatura = localStorage.idasignatura
      let h_nombreasignatura = localStorage.nombreasignatura
      let h_recursotipo = 1; //1 = libro
      let datoHistorico = {
          'user_nombre': me.miusuario.nombres,
          'user_apellido': me.miusuario.apellidos,
          'user_email': me.miusuario.email,
          'user_cedula': me.miusuario.cedula,
          'recurso_accion': 'ver',
          'recurso_tipo': 'libro unidad',
          'recurso_nombre': 'unidad ' + item.unidad,
          'recurso_detalle': item.nombre_unidad,
      }
      // console.log(h_idinstitucion, h_idusuario, h_idgrupo, h_idasignatura, h_nombreasignatura, h_recursotipo,datoHistorico)
      me.historicoVisitas(h_idinstitucion, h_idusuario, h_idgrupo, h_idasignatura, h_nombreasignatura, h_recursotipo, datoHistorico);
      me.saveHistoricoVisitas(h_idinstitucion, h_idusuario, h_idgrupo, h_idasignatura,h_nombreasignatura,  h_recursotipo,datoHistorico)
      if (this.grupo_usuario == 10) {
          // perfil director
          this.$router.push('/director/institucion/docentes/contenidos/libro/unidad');
      }
      if (this.grupo_usuario == 16){
          this.$router.push('/colegios/docente/libro/desgloseunidad');
      }
      else {
          this.$router.push('/docente/libro/desgloseunidad');
      }
    },
  }
}
</script>
<style scoped>
  /* Modern Card Styles */
  .letrascard {
    padding: 10px 0px 10px 0px;
    color: white;
    font-size: 17px;
    position: relative;
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.9) 0%, rgba(168, 85, 247, 0.9) 100%);
    backdrop-filter: blur(10px);
    border-radius: 12px;
  }

  .letrac {
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 0.3px;
  }

  .btn_ver {
    font-size: 14px;
    padding: 5px 15px 5px 15px !important;
    border-radius: 8px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .btn_ver:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
  }

  .imagencard {
    border-radius: 16px;
  }

  /* Modern Card Container */
  .padre {
    position: relative;
    box-sizing: border-box;
    background: linear-gradient(145deg, #ffffff, #f8fafc);
    margin: 16px;
    border-radius: 16px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
                0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }

  .padre:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.15),
                0 10px 10px -5px rgba(0, 0, 0, 0.08);
  }

  .padre:active {
    transform: translateY(-4px) scale(1.01);
  }

  /* Modern Image Styles */
  .imagen {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    border-radius: 16px;
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .padre:hover .imagen {
    transform: scale(1.05);
  }

  /* Modern Semi-Transparent Overlay - Compact & Professional */
  .hijo {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    background: linear-gradient(
      to top,
      rgba(30, 41, 59, 0.80) 0%,
      rgba(51, 65, 85, 0.70) 60%,
      rgba(71, 85, 105, 0.40) 100%
    );
    backdrop-filter: blur(6px) saturate(120%);
    -webkit-backdrop-filter: blur(6px) saturate(120%);
    padding: 8px 10px;
    box-sizing: border-box;
    color: white;
    text-align: center;
    font-size: 13px;
    line-height: 1.3;
    border-top: 1px solid rgba(255, 255, 255, 0.25);
    box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.15);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .padre:hover .hijo {
    padding: 10px 12px;
    background: linear-gradient(
      to top,
      rgba(15, 23, 42, 0.88) 0%,
      rgba(30, 41, 59, 0.78) 60%,
      rgba(51, 65, 85, 0.50) 100%
    );
    backdrop-filter: blur(8px) saturate(130%);
    -webkit-backdrop-filter: blur(8px) saturate(130%);
  }

  .hijo p {
    margin: 0;
    padding: 0;
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
    transition: all 0.3s ease;
  }

  .hijo .font-bold {
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 0.3px;
    margin-bottom: 2px;
    line-height: 1.2;
  }

  .hijo p:not(.font-bold) {
    font-size: 12px;
    font-weight: 400;
    opacity: 0.95;
  }

  .hijo small {
    font-size: 11px;
    display: block;
    margin-top: 2px;
    opacity: 0.9;
  }

  .padre:hover .hijo p {
    transform: translateY(-1px);
  }

  /* Smooth Animations */
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .padre {
    animation: fadeInUp 0.5s ease-out backwards;
  }

  .padre:nth-child(1) { animation-delay: 0.05s; }
  .padre:nth-child(2) { animation-delay: 0.1s; }
  .padre:nth-child(3) { animation-delay: 0.15s; }
  .padre:nth-child(4) { animation-delay: 0.2s; }
  .padre:nth-child(5) { animation-delay: 0.25s; }
  .padre:nth-child(n+6) { animation-delay: 0.3s; }

  /* Responsive Design */
  @media (max-width: 768px) {
    .padre {
      margin: 12px;
    }

    .hijo {
      padding: 12px 10px;
      font-size: 14px;
    }

    .hijo .font-bold {
      font-size: 15px;
    }
  }

  /* Add subtle glow effect on hover */
  .padre::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 16px;
    padding: 2px;
    background: linear-gradient(135deg, #6366f1, #a855f7, #ec4899);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask-composite: exclude;
    opacity: 0;
    transition: opacity 0.4s ease;
  }

  .padre:hover::before {
    opacity: 0.6;
  }
</style>
