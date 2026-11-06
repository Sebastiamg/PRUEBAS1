<template>
  <div>
    <vs-button color="danger" @click="crearMaterial()" type="border">Crear Material</vs-button>
    <div>
      <vs-table max-items="8" search pagination stripe :data="arreglomaterial">
        <template slot="header">
          <h3>
            Mantenimiento de Subir material
          </h3>
        </template>
        <template slot="thead">
          <vs-th>
            N° material
          </vs-th>
          <vs-th>
            Libro
          </vs-th>
          <vs-th>
            Estado
          </vs-th>
          <vs-th >
            Accion
          </vs-th>
        </template>
        <template slot-scope="{data}" id="reporte">
          <vs-tr :key="indextr" v-for="(tr, indextr) in data" >
            <vs-td :data="data[indextr].id">
              {{data[indextr].id}}
            </vs-td>
            <vs-td :data="data[indextr].nombrelibro">
              {{data[indextr].nombrelibro}} 
            </vs-td>        
            <vs-td >
              <template v-if="data[indextr].estado =='1'">
                <p>Activado</p>
              </template>
              <template v-else>
                <p>Desactivado</p>
              </template>
            </vs-td>
            <vs-td> 
              <div style="display:flex">
                  <vx-tooltip style="display: inline-block;" text="Información" position="top" color="primary">
                      <vs-button radius color="primary" type="line" icon="info" @click="infoArchivo(data[indextr].id,data[indextr].id_libro);">
                      </vs-button>
                  </vx-tooltip> &nbsp;

      
                  <template v-if="data[indextr].estado == '1'" class="ml-2">
                    <vx-tooltip style="display: inline-block;" text="Desactivar" position="top" color="primary">
                        <vs-button radius color="danger" type="line" icon="close" @click="desactivar(data[indextr].id)">
                        </vs-button>
                    </vx-tooltip> &nbsp;
                  </template>

                  <template v-else>
                    <vx-tooltip style="display: inline-block;" text="Activar" position="top" color="primary">
                        <vs-button radius color="success" type="line" icon="check_box" @click="activar(data[indextr].id)">
                        </vs-button>
                    </vx-tooltip> &nbsp;
                  </template>
              </div>     
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
import  jsPDF  from "jspdf";
import html2canvas from "html2canvas";
export default {
  name:'pdf',
  data:()=>({
      update:true,
      id:0,
      titleModal: '',
      // para el select de libros
      arregloLibros:[],
      arreglomaterial:[],
      //para el select de unidades
      arregloTraeUnidades:[],
       //para el select de temas
      arregloTraerTemas:[],
      //para subir archivos,
      attachments:[],
      dataarchivos:[],
      form: new FormData,
      //para ver info de los archivos
      infoarchivos:[],
     /*Modal*/
      popupActivo2:false,
  }),
    components: {
        'v-select': vSelect,        
      },
  methods:{
    //listar
  	list(){
      let me = this;
      me.$vs.loading() 
  		 this.$http.get(this.$server_url+`cargarmaterial`).then(res => {
          this.arreglomaterial = res.data.material;
          me.$vs.loading.close();       
          
        })
        .catch(function (error) {
          console.log(error)
        })
  	},
    //crear material
    crearMaterial(){
        this.$router.push('/subirmaterial/');
    },
    //para ver info de los archivos
    infoArchivo(id,id_libro){
      localStorage.setItem("infoarchivosid", JSON.stringify(id));
      localStorage.setItem("infoarchivolibro", JSON.stringify(id_libro));
      let me = this;
      me.$router.push('/infoarchivo/');
    },
    //desactivar el estado de la tabla
    desactivar(id){
      let me = this;
      let formData = new FormData();
      formData.append('id',id );
      me.$vs.loading()
      this.$http.post(this.$server_url+'cargarmaterial/desactivar', formData)
      .then(res => {    
        me.$vs.loading.close();
        me.list();
        me.$vs.notify({
        text:'Estado material  actualizado',
        color:'success',
        iconPack: 'feather',
        icon:'icon-check'})
      })
    },
    activar(id){
      let me = this;
      let formData = new FormData();
      formData.append('id', id);
      me.$vs.loading()
      this.$http.post(this.$server_url+'cargarmaterial/activar', formData)
      .then(res => {
        me.$vs.loading.close();
        me.list();
        me.$vs.notify({
        text:'Estado material actualizado  exitosamente',
        color:'success',
        iconPack: 'feather',
        icon:'icon-check'})
      })
    }, 
  },
  created(){
  	this.list();
  }
}
</script>



