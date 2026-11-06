<template>
<div>

  <vs-prompt @cancel="modal_juego=false;" @accept="guardarJuego()" @close="modal_juego=false;" :active.sync="modal_juego" color="primary" title="Juego" acceptText="Aceptar" cancelText="Cancelar">
      <div class="w-full">
        <div style="border: 1px solid #d5d5d5; border-radius: 10px; padding: 5px 5px 5px 5px;" align="center" class="mb-2">
            <input type="file" name="file1" id="file1" class="inputfile" style="display: none;" v-on:change="mostrarImg(1,1)" accept="image/*">
            <label for="file1" style="margin-bottom: -10px; cursor: pointer; color: gray; width: 100%; font-size: 11px; line-height: 80%;">
                Click aquí para subir una imagen <b>600x600</b>
            </label>
            <img v-if="src_imagen_juego != ''" id="img1" class="mb-2" v-bind:src="$data_url + 'archivos/images/imagenes_juegos/rompecabezas/' + src_imagen_juego" style="border-radius: 5px; width: 100%;">
        </div>

        <vs-input label="Título juego" v-model="titulo" class="w-full" />

      </div>
  </vs-prompt>


  <div class="w-full mb-2" align="left">
    <vs-button size="small" class="px-4 py-3 text-sm" color="black" @click="id_rompecabezas=''; src_imagen_juego=''; titulo=''; img_old=''; modal_juego=true;">Agregar imagen</vs-button>
  </div>

  <div class="vx-row">
      <div class="vx-col w-1/2 md:w-1/3 sm:1/2 xl:w-1/4 mt-3" v-for="(item,$index) in juegos" :key="$index">
          <vx-card class="text-center">
              <div slot="no-body">
                  <img class="responsive card-img-top" v-bind:src="$data_url + 'archivos/images/imagenes_juegos/rompecabezas/' + item.imagen">
              </div>
              <p class="font-bold"> {{item.descripcion}} </p>
              <div class="w-3/3 ml-auto mt-3">
                  <vs-button color="primary" class="p-2 m-1" type="border" icon-pack="feather" @click="ver_form_juego(item)" icon="icon-edit" style="display: inline-block; width: 100px;"></vs-button>
                  <vs-button color="danger" class="p-2 m-1" type="border" icon-pack="feather" @click="id_rompecabezas=item.id_contenido_juego;  openConfirm()" icon="icon-trash" style="display: inline-block; width: 100px;"></vs-button>
              </div>
          </vx-card>
      </div>
  </div>


</div>
</template>

<script>
    import Vue from 'vue'
    import axios from 'axios'
    import vSelect from 'vue-select'
    import $ from 'jquery'
    Vue.use(axios)
    export default {
        data(){
            return {
                usuario: [],
                juegos: {},
                id_juego: '',
                titulo: '',
                img_portada: '',
                src_imagen_juego: '',
                img_old: '',
                modal_juego: false,
                tipo_juego: 'ROMPECABEZAS',
                id_rompecabezas: '',
            }
        },
        components: {
                'v-select': vSelect,
        },
        created(){
            let me = this
            me.usuario = JSON.parse(localStorage.getItem('usuario'))
            me.id_juego = localStorage.getItem('id_rompecabezas')

        },
        mounted() {
          this.get_img_rompecabezas()
        },
        methods: {
            get_img_rompecabezas(){
                let me = this
                axios.get(me.$server_url+'get_img_rompecabezas/'+me.id_juego)
                .then(res => {
                    me.juegos = res.data;
                    me.$vs.loading.close()
                })
            },
            mostrarImg(file, img){
                let me = this;
                me.src_imagen_juego = ' ';
                var archivo = document.getElementById("file"+file).files[0];
                if( archivo.type != 'image/png' && archivo.type != 'image/jpeg' ){
                   me.$vs.notify({ text:'Formato no permitido', color:'warning', iconPack: 'feather', icon:'icon-alert-triangle'})
                   me.modal_juego = false
                   window.$("#file"+file).val('')
                   return
                }

                var reader = new FileReader();
                reader.readAsDataURL(archivo);
                reader.onload = function (e) {
                    var image = new Image();
                    image.src = e.target.result;
                    image.onload = function () {
                        var height = this.height;
                        var width = this.width;
                        if (height != 600 || width != 600) {
                            me.src_imagen_juego = ''
                            window.$("#file"+file).val('')
                            me.$vs.notify({ text:'Tamaño de imagen no permitido, la medida recomendada es 600x600', color:'warning', iconPack: 'feather', icon:'icon-alert-triangle'})
                            return
                        }
                    };

                    // mostrar imagen
                    var reader = new FileReader();
                    if (me) {
                        reader.readAsDataURL(archivo );
                        reader.onloadend = function () {
                            document.getElementById("img"+img).src = reader.result;
                        }
                    }
                }
            },
            guardarJuego(){
                let me = this;

                if( me.titulo == '' || me.src_imagen_juego == '' ){
                    me.$vs.notify({ text:'Debe completar todos los campos antes de continuar', color:'warning', iconPack: 'feather', icon:'icon-alert-triangle'})
                    return
                }

                let fileImgPreg;
                fileImgPreg = document.getElementById("file1").files[0];
                if(fileImgPreg === undefined ){
                    fileImgPreg = me.imagen;
                }

                me.$vs.loading()
                const formData = new FormData();
                    formData.append('id', me.id_rompecabezas);
                    formData.append('img_portada', fileImgPreg);
                    formData.append('img_old', me.img_old);
                    formData.append('titulo', me.titulo);
                    formData.append('id_juego', me.id_juego);

                axios.post(this.$data_url+'api/save_rompecabezas', formData)
                .then(res => {
                  me.$vs.loading.close()
                      console.log('*************')
                      console.log(res.data)
                      console.log('*************')
                      me.$vs.notify({ text:'Guardado correctamente', color:'success', iconPack: 'feather', icon:'icon-check'})
                      me.get_img_rompecabezas()
                })
                .catch(function (error) {
                  console.log('*********************')
                  console.log(error)
                  console.log('*********************')
                  me.$vs.loading.close()
                })
            },
            ver_form_juego(item){
              let me = this
                me.id_rompecabezas = item.id_contenido_juego
                me.img_old = item.imagen
                me.titulo = item.descripcion
                me.src_imagen_juego = item.imagen
                me.modal_juego = true
            },
            openConfirm() {
              this.$vs.dialog({
                type: 'confirm',
                color: 'danger',
                title: `Confirmar`,
                text: '¿Está seguro de eliminar este rompecabezas?',
                accept: this.acceptEliminar
              })
            },
            acceptEliminar() {
              let me = this
              axios.get(this.$data_url+'api/delete_rompecabezas/' + me.id_rompecabezas)
              .then(res => {
                me.$vs.loading.close()
                this.$vs.notify({ color: 'danger', title: 'Rompecabezas eliminado', text: 'Ya no estará disponible.' })
                me.get_img_rompecabezas()
              })
            },

        },
    }
</script>
