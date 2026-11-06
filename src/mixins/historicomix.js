
import Vue from 'vue'
import axios from 'axios'
// import io from 'socket.io-client';
export default {
   data(){
       return{
        myVariable:10,
       }
   },
    // created() {
    //   console.log("holaaaaaaa");
    // },
    methods: {
         historicoVisitas(idinstitucion, idusuario, idgrupo, idasignatura, nombreasignatura, recurso, datos) {

            console.log("historico")
            //recurso> (1:libro, 2:unidades, 3:cuadernos, 4:teletarea, 5:proyectos, 6:adaptaciones, 7:propuestas, 8:juegos, 9:material, 10:articulos, 11:tareas, 12:pdf guia, 13:pdf sin guia, 14:guia didactica)

        //    // datos: TIPO JSON
        //     - user_nombre
        //     - user_apellido
        //     - user_email
        //     - user_cedula
        //     - recurso_accion: (crear - ver -descargar - eliminar)
        //     - recurso_nombre (Libro de Mate 7, cuaderno de lengua 9, teletarea de mate 2, nombre del Proyecto, o adaptacion o propuesta, juego Sopa de letras, material Mapa politico, etc)
        //     - recurso_detalle (nombre del libro o archivo .doc o .pdf si existe)

            let me = this;

         },
        //guardar historico
         saveHistoricoVisitas(idinstitucion, idusuario, idgrupo, idasignatura,nombreasignatura,recurso, datos, id_curso=null){
            let me = this;
            let formData = new FormData();
            formData.append('idusuario',      idusuario)
            formData.append('institucion_id', idinstitucion)
            formData.append('id_group',       idgrupo)
            formData.append('recurso',        recurso)
            formData.append('nombreasignatura',nombreasignatura)
            formData.append('idasignatura',   idasignatura)
            formData.append('id_curso',       id_curso || null)
            formData.append('datos',          JSON.stringify(datos) || null)
            this.$http.post(this.$server_url+'historico', formData)
              .then(res => {
                console.log(res.data.message)
              })
              .catch(function(e){
                console.log(e)
              })
          },

          //historico hospital
          historicoHospital(idusuario,accion,datos){
            let me = this;
            let formData = new FormData();
            formData.append('idusuario',      idusuario)
            formData.append('accion',      accion)
            formData.append('datos',          JSON.stringify(datos))
            this.$http.post(this.$server_url+'historicoHospital', formData)
              .then(res => {
                console.log(res.data.message)
              })
              .catch(function(e){
                console.log(e)
              })
          },
          //guardar notificaciones
          saveNotifications(idusuario,id_created,tipo,descripcion){
            let me = this;
            let formData = new FormData();
            formData.append('idusuario',        idusuario)
            formData.append('descripcion',      descripcion)
            formData.append('tipo',             tipo)
            formData.append('id_created',       id_created)
            this.$http.post(this.$server_url+'saveNotification', formData)
              .then(res => {
                localStorage.setItem('notificacion','yes')
                // me.setSocket(descripcion)
                console.log(res.data)
              })
              .catch(function(e){
                console.log(e)
              })
          },
          // setSocket(dato){
          //     let me = this;
          //     try {
          //     this.$socket.emit('enviar',dato);
          //     this.$socket.on('enviar',(arg) => {
          //     console.log(arg)
          //     return
          //     });
          //     } catch (error) {
          //         console.log(error)
          //     }
          // },

    },
  };
