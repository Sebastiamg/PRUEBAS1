<template>
    <div>
        <div>
              <!---PARA EDITAR LOS DETALLES DE LA MUESTRA-->
            <vs-divider class="mt-5" color="success">Mantenimiento de las evidencias</vs-divider>
            <vs-row v-if="popupEditEvidencia == 1">
                <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                    <div v-if="detalleMuestra.length >0" style="width: 100%;">
                        <vs-table stripe max-items="5" search pagination :data="detalleMuestra">
                            <template slot="header">
                                <div class="vx-row">
                                    <div class="vx-col w-full m-3">
                                        Cantidad: {{detalleMuestra.length}}
                                    </div>

                                </div>
                            </template>
                            <template slot="thead">
                                <vs-th sort-key="nombreInstitucion">Libro</vs-th>
                                <vs-th sort-key="nombre">Cantidad entregadas</vs-th>
                                <vs-th sort-key="nombre">Cantidad devueltas</vs-th>
                               
                                <vs-th>Acciones</vs-th>
                            </template>
                            <template slot-scope="{data}">
                                <vs-tr :key="indextr" v-for="(tr, indextr) in data">

                                    <vs-td :data="data[indextr].nombrelibro">
                                        {{data[indextr].nombrelibro}}<br>
                                    </vs-td>
                                    <vs-td :data="data[indextr].cantidad">
                                        {{data[indextr].cantidad}} <br>
                                    </vs-td>
                                    <vs-td :data="data[indextr].cantidad_devolucion">
                                        {{data[indextr].cantidad_devolucion}} <br>
                                    </vs-td>
                              
                                
                                    <vs-td>
                                        <div class="flex">
                                            <vx-tooltip style="display: inline-block;" text="Editar evidencia" position="top" color="primary">
                                                <vs-button radius color="success" @click="openModalEditarEvidencia(tr)"  type="line" icon="edit"></vs-button>
                                            </vx-tooltip> &nbsp;  
                                            <vx-tooltip style="display: inline-block;" text="Eliminar evidencia" position="top" color="primary">
                                                <vs-button radius color="danger" @click="openConfirmarEliminarEvidencia(tr)" type="line" icon="delete"></vs-button>
                                            </vx-tooltip> &nbsp;  
                                        </div>
                                    </vs-td>
                                </vs-tr>
                            </template>
                        </vs-table>
                    </div>
                    <div v-else>
                        <vs-alert active="true" color="warning">
                            No hay evidencias cargadas
                        </vs-alert>
                    </div>
                </vs-col>
            </vs-row>
        </div>

        <div v-if="eliminarEstado == true">
            <vs-alert active="true">
                <p style="text-align:center;">Estas seguro de eliminar la evidencia?</p>
                
            </vs-alert>
            <div style="display:flex;justify-content:center;">
                <vs-button line-origin="left" @click="eliminarEvidencia()" color="success" type="line">Si, acepto eliminar</vs-button>
                <vs-button  color="danger" @click="eliminarEstado = false;popupEditEvidencia = 1" type="line">Cancelar</vs-button>
            </div>
          

        </div>

        <!--MODAL PARA EDITAR CADA EVIDENCIA-->
        <div v-if="popupEditEvidencia == 2">
            <vs-button radius color="success" @click="popupEditEvidencia = 1" type="gradient" icon="reply"></vs-button>
            <br/>
            <vs-row>
                <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                    <v-select :options="libros" :reduce="libros => libros" v-model="evidencia.libro_id" label="nombrelibro" class="w-full" />
                </vs-col>
            </vs-row>

            <vs-row class="mt-3">
                <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                    <vs-input type="number" label="Cantidad libros entregados" style="width: 96%;" placeholder="Libros entregados" v-model="evidencia.cantidad"/>
                </vs-col>
                <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                    <vs-input type="number" label="Cantidad libros devueltos" class="ml-2" style="width: 96%;" placeholder="Libros devueltos" v-model="evidencia.cantidad_devolucion"/>
                </vs-col>
            </vs-row>

            <vs-row class="mt-5">
                <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                    <vs-button @click="ActualizarEvidencia()" type="gradient">Actualizar evidencia</vs-button>
                </vs-col>
            </vs-row>
        </div>
    </div>
</template>

<script>
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import Vue from 'vue'
import axios from 'axios'
import vSelect from 'vue-select'
export default {
    data() {
       return{
           eliminarEstado:false,
           popupEditEvidencia:1,
            detalleMuestra:[],
            evidencia:{
                libro_id:'',
                cantidad:'',
                cantidad_devolucion:'',
                fecha_devolucion:null,
                evidencia:'',
            },
            configdateTimePicker: {
                enableTime: true,
                dateFormat: 'Y-m-d'
            },
            libros:[]
       } 
    },
    mounted(){
        let me = this;
        me.DetalleMuestras();
        me.getLibros()
    },
    props:{
        id:{
            type:String,
            default:"0"
        }
    },
     components: {
        'v-select': vSelect,
        flatPickr

    },

    methods:{

            //para obtener el listado de Tipos de Area
        getLibros() {
            let me = this;
            this.$http.get(this.$server_url + 'listaLibro')
                .then(function (res) {
                    me.libros = res.data.libros
                })
                .catch(function (error) {
                    console.log(error + ' error')
                })
        },

          //METODOS PARA LA ENVIDENCIAS
        //Listar el detalle de la muestra
        async DetalleMuestras() {
            let me = this;
            this.$http.get(this.$server_url+'muestraDetalle?muestra_id=' + me.id)
                .then(function (res) {
                    me.detalleMuestra = res.data    
                })
                .catch(function (error) {       
                })
        },
     
        //modal para preguntar si quiere elimianr
        openConfirmarEliminarEvidencia(tr){
            let me = this;
            me.evidencia.id = tr.id
            me.popupEditEvidencia = 3
            me.eliminarEstado = true
        },

          
         eliminarEvidencia(){
            let me = this;   
            let formData = new FormData();
            formData.append('id', me.evidencia.id)
            me.$vs.loading()
            axios.post(this.$data_url+'api/EliminarDetalleMuestra', formData)
            // this.$http.post(this.$server_url+'EliminarDetalleMuestra',formData)
        
                .then(function (res) {
                    me.$vs.loading.close();
                    me.$vs.notify({
                        text: res.data.message,
                        color: 'primary',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                    me.popupEditEvidencia =1;
                    me.eliminarEstado = false
                    me.DetalleMuestras();
                    me.attachments = [];
                    me.archivoName='';
                    me.evidencia.id = ''
                })
                .catch(function (error) {
                    me.$vs.loading.close();
                })
        },
        openModalEditarEvidencia(tr){
          let me = this;
          me.evidencia.id = tr.id
          me.evidencia.libro_id = {idlibro:tr.libro_id,nombrelibro:tr.nombrelibro}
          me.evidencia.cantidad = tr.cantidad
          me.evidencia.cantidad_devolucion = tr.cantidad_devolucion
          me.evidencia.fecha_devolucion = tr.fecha_devolucion
      
          me.popupEditEvidencia = 2
         
        },
         ActualizarEvidencia(){
            let me = this;
        
            if(me.evidencia.cantidad_devolucion > me.evidencia.cantidad){
                 me.$vs.notify({
                  text:'La cantidad devuelta no puede ser mayor a la cantidad entregada',
                  color:'success',
                  iconPack: 'feather',
                  icon:'icon-check'})
                return false;
            }

               
            let formData = new FormData();
            formData.append('id',                   me.evidencia.id);
            formData.append('libro_id',             me.evidencia.libro_id.idlibro);
            formData.append('cantidad',             me.evidencia.cantidad);
            formData.append('cantidad_devolucion',  me.evidencia.cantidad_devolucion);
            if(me.evidencia.fecha_devolucion !=null  || me.evidencia.fecha_devolucion != undefined || me.evidencia.fecha_devolucion == ''){
               formData.append('fecha_devolucion',     me.evidencia.fecha_devolucion);
            }

            const config = { headers: { 'Content-Type': 'multipart/form-data' } };
            document.querySelectorAll('.upload-file').value=[];
            me.$vs.loading()
            axios.post(this.$data_url+'api/EditarDetalle', formData, config)
            // this.$http.post(this.$server_url+'EditarDetalle',formData, config)
        
                .then(function (res) {
                    me.$vs.loading.close();
                    me.$vs.notify({
                        text: res.data.message,
                        color: 'primary',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                    me.popupEditEvidencia =1;
                    me.DetalleMuestras();
                    me.attachments = [];
                    me.archivoName='';
                })
                .catch(function (error) {
                    me.$vs.loading.close();
                })
        },

    }
}
</script>