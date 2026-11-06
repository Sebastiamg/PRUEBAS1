<template>
  <div>

     	<!--- MODAL PARA AGREGAR -->
    <div class="centerx">
      <vs-button @click="popupActivo2=true;update = false; openModal();" color="primary" type="filled">Agregar</vs-button>
      <br>
      <br>
      <br>
      <vs-popup classContent="popup-example"  :title="titleModal" :active.sync="popupActivo2">


      <!--   {{ libro.nombrelibro  }} -->
      <div class="vx-col w-full mt-5">

          Libro:
          <v-select :options="arregloLibros" :reduce="arregloLibros => arregloLibros" label="nombrelibro" class="w-full" v-model="libro.nombrelibro" />
      </div>
      
        <br>

      <div class="vx-col w-full mt-5">

        Serie:
        <v-select :options="arregloSeries" :reduce="arregloSeries => arregloSeries" label="nombre_serie" class="w-full" v-model="libro.nombre_serie" />
      </div>
      <!--  <label>Serie</label>
        <vs-input class="inputx" name ="id_serie" placeholder="serie" v-model="libro.nombre_serie"/> -->
        <div class="vx-col w-full mt-5">
          <label>Inicial</label>
          <vs-input class="inputx w-full" name ="iniciales" placeholder="inicial" v-model="libro.iniciales"/>
        </div>

        <div class="vx-col w-full mt-5">
        <label>Liquidacion</label>
        <vs-input class="inputx w-full" name= "codigo_liquidacion" placeholder="liquidacion" v-model="libro.codigo_liquidacion"/>
        </div>

        <div class="vx-col w-full mt-5">
          <label>Nombre</label>
          <vs-input class="inputx w-full" name="nombre" placeholder="nombre" v-model="libro.nombre"/>
        </div>

        <div class="vx-col w-full mt-5">
          <label>Year</label>
          <vs-input class="inputx w-full" name="year" placeholder="año" v-model="libro.year"/>
        </div>

        <div class="vx-col w-full mt-5">
          <label>Version</label>
          <vs-input class="inputx w-full" name="version2" placeholder="version" v-model="libro.version2"/>
        </div>
        <br>
        <vs-button @click="popupActivo3=true; agregar();" color="primary" type="filled">Guardar Cambios</vs-button>
    
      </vs-popup>
    </div>
    <!--FIn del Modal para agregar libro serie-->
    
    <!--Tabla del listado de libros series-->
    <div>
      <vs-table max-items="10" search pagination :data="libros">
        <template slot="header">
          <h3>
            Libros serie
          </h3>
        </template>

        <template slot="thead">
          <vs-th>
            Libro
          </vs-th>
          <vs-th>
            Serie
          </vs-th>
          <vs-th>
            Inicial
          </vs-th>
          <vs-th>
            Liquidacion
          </vs-th>
          <vs-th>
            Nombre
          </vs-th>
          <vs-th>
            Version
          </vs-th>
            <vs-th>
            Year
          </vs-th>
          <vs-th>
            Estado
          </vs-th>
          <vs-th>
            Accion
          </vs-th>
        </template>




        <template slot-scope="{data}">
          <vs-tr :key="indextr" v-for="(tr, indextr) in data" >
            <vs-td :data="data[indextr].nombrelibro">
              {{data[indextr].nombrelibro}}
            </vs-td>

            <vs-td :data="data[indextr].nombre_serie">
              {{data[indextr].nombre_serie}}
            </vs-td>

            <vs-td :data="data[indextr].iniciales">
              {{data[indextr].iniciales}}
            </vs-td>

            <vs-td :data="data[indextr].codigo_liquidacion">
              {{data[indextr].codigo_liquidacion}}
            </vs-td>
            <vs-td :data="data[indextr].nombre">
              {{data[indextr].nombre}}
            </vs-td>
            <vs-td :data="data[indextr].version">
              {{data[indextr].version}}
            </vs-td>
            <vs-td :data="data[indextr].year">
              {{data[indextr].year}}
            </vs-td>

          
            <vs-td >
              <template v-if="data[indextr].estado">
                <p>Activado</p>
              </template>
              <template v-else>
                <p>Desactivado</p>
              </template>
            </vs-td>
          
            <vs-td>
              <!-- {{ data[indextr] }} -->
              <vs-button color="warning" size="small" type="filled" @click = "update = true; openModal(data[indextr]);">
              Editar
              </vs-button>
            </vs-td>

            <vs-td>
                <template v-if="data[indextr].estado">
                  <vs-button color="danger" size="small" type="filled" @click = "desactivarlibroserie(data[indextr].id_libro_serie)">
                  Desact.
                  </vs-button>
            
                </template>

                <template v-else>
                  <vs-button color="success" size="small" type="filled" @click = "activarlibroserie(data[indextr].id_libro_serie)">
                  Activar
                  </vs-button>
                  
                </template>
            </vs-td>

          </vs-tr>
        </template>
      </vs-table>
    </div>  
  </div>
</template>
<script>

import axios from 'axios'
import vSelect from 'vue-select'

export default {
  data:()=>({
      update:true,
      id:0,
      titleModal: '',
      // para el select de libros
      arregloLibros:[],
      arregloSeries:[],
   /*Modal*/
     
      value1:'',
      value2:'',
      popupActivo2:false,
      popupActivo3:false,
      //listado
    libros:[
    
    ],
     libro:{
        nombrelibro:'',
        nombre_serie:'',
        iniciales:'',
        codigo_liquidacion:'',
        nombre:'',
        year:'',
        version2:''

       
    },
  }),

    components: {
                'v-select': vSelect,
                
        },

  methods:{

    //lista de libros para usar en el select
      listalibros(){
        let me = this
       this.$http.get(this.$server_url+`libroserie`).then(res => {
                    me.arregloLibros = res.data.libroslista;
                   console.log(me.arregloLibros);
              
                  
                })
                .catch(function (error) {
                  console.log(error)
                })

    
    },
     //lista de series para usar en el select
      listaSeries(){
        let me = this
       this.$http.get(this.$server_url+`libroserie`).then(res => {
                    me.arregloSeries = res.data.serieslista;
                   
              
                  
                })
                .catch(function (error) {
                  console.log(error)
                })

    
    },

    //listar
  	  list(){
      let me = this;
      me.$vs.loading() 
  		 this.$http.get(this.$server_url+`libroserie`).then(res => {
                    this.libros = res.data.librosSerie;
                  
                   console.log(this.listalibros);
       me.$vs.loading.close();       
                  
                })
                .catch(function (error) {
                	console.log(error)
                })
  

  	
  	},
    //desactivar el estado de la tabla

    desactivarlibroserie(id_libro_serie){


              let me = this;
              let formData = new FormData();
                  formData.append('id_libro_serie',id_libro_serie );
                 
              me.$vs.loading()
              this.$http.post(this.$server_url+'libroserie/desactivar', formData)
              .then(res => {
                  
                 me.list();
                  me.popupAddTema = false
                  me.$vs.loading.close()
                  me.$vs.notify({
                  text:'Estado libro serie actualizado',
                  color:'success',
                  iconPack: 'feather',
                  icon:'icon-check'})
              })

    },

    activarlibroserie(id_libro_serie){
    

            let me = this;
            let formData = new FormData();
                formData.append('id_libro_serie', id_libro_serie);
               
            me.$vs.loading()
            this.$http.post(this.$server_url+'libroserie/activar', formData)
            .then(res => {
                
               me.list();
                me.popupAddTema = false
                me.$vs.loading.close()
                me.$vs.notify({
                text:'Estado libre serie actualizado  exitosamente',
                color:'success',
                iconPack: 'feather',
                icon:'icon-check'})
            })

    },
 




              agregar(){

              //datos que se obtienen de los inputs
                // if(this.libro.iniciales.trim() === '' || this.libro.codigo_liquidacion.trim() === '' || this.libro.nombre.trim() === '' || this.libro.year.trim() === ''  || this.libro.version2.trim() === ''){
                //     this.$vs.notify({
                //         text:'Debe completar todos los campos antes de guardar',
                //         color:'warning',
                //         iconPack: 'feather',
                //         icon:'icon-check'})
                //     return;
                // }
                let me = this;
                let formData = new FormData();

                  if(me.update){
                     formData.append('id', me.id);
                  }
                    formData.append('idLibro', me.libro.nombrelibro.idlibro);
                    formData.append('id_serie', me.libro.nombre_serie.id_serie);
                    formData.append('iniciales', me.libro.iniciales);
                    formData.append('codigo_liquidacion', me.libro.codigo_liquidacion);
                    formData.append('nombre', me.libro.nombre);
                     formData.append('year', me.libro.year);
                    formData.append('version2', me.libro.version2);
                me.$vs.loading()
                this.$http.post(this.$server_url+'libroserie', formData)
                .then(res => {
                    
                   me.list();
                    me.popupAddTema = false
                    me.$vs.loading.close()
                    me.$vs.notify({
                    text:'Libro serie guardado exitosamente',
                    color:'success',
                    iconPack: 'feather',
                    icon:'icon-check'})
                })
            },


          openModal(data={}){
             this.popupActivo2 = true;
              if(this.update){
                this.id  = data.id_libro_serie;
                this.titleModal = "Modificar Contacto";

                this.libro.nombrelibro = {idlibro:data.idlibro, nombrelibro:data.nombrelibro};
                this.libro.nombre_serie = {id_serie:data.id_serie, pnombres:data.pnombres};
                this.libro.iniciales = data.iniciales;
                this.libro.codigo_liquidacion = data.codigo_liquidacion;
                this.libro.nombre = data.nombre;
                this.libro.year = data.year;
                this.libro.version2 = data.version;




              }else{
                this.id = 0;
                 this.titleModal = "Crear Contacto";

                 this.libro.nombrelibro = '';
                 this.libro.nombre_serie= '';
                 this.libro.iniciales= '';
                 this.libro.codigo_liquidacion = '';
                 this.libro.nombre = '';
                 this.libro.version2 = '';
              }
    },

    // //para confirmar antes de realizar
    // openConfirm() {
    //             this.$vs.dialog({
    //                 type: 'confirm',
    //                 color: 'danger',
    //                 title: `Confirmar`,
    //                 text: '¿Está seguro de eliminar este tema y todas las preguntas que contenga?',
    //                 accept: this.eliminarTema
    //             })
    //         },


  },

  created(){
  	this.list();
    this.listalibros();
    this.listaSeries();
  
  }
}
</script>



