<template>
<div>
    <data-view-sidebar :isSidebarActive="addNewDataSidebar" @closeSidebar="toggleDataSidebar" :data="sidebarData" />
    <data-view-sidebar-editar :isSidebarActive="addNewDataSidebarEditar" @closeSidebar="toggleDataSidebarEditar" :data="sidebarDataEditar" :contenido="cont" />

    <vs-row vs-justify="flex-start">
                <vs-col type="flex" vs-justify="flex-start" vs-align="flex-start" class="m-2" vs-w="12">
                 
                    <vs-card>
                        <p>Filtro de búsqueda</p>
                         <br/> <br/>
    
                        <div style="">
                          
                            <vs-input class="w-full" icon-after="true" label-placeholder="icon-after" style="margin:0px 0px 20px 0px;"  icon="search" placeholder="Ingrese el criterio de búsqueda"  v-model="razonBusqueda"/>
                        </div>
                        
                    

                        <div style="">
                        
                            <ul class="leftx" style="display:flex;margin:0px 0px 0px 20px;">
                                <li class="modelx">
                        
                                </li>
                                <li style="margin:10px 20px 0px 0px;">
                                
                                <vs-radio vs-name="radios1" vs-value="0" v-model="valorBusqueda" @input="busqueda='asignatura'">Asignatura</vs-radio>
                                </li>
                                <li style="margin:10px 10px 0px 0px;">
                                <vs-radio vs-name="radios1" vs-value="1" v-model="valorBusqueda"  @input="busqueda='archivo'">Nombre archivo</vs-radio>
                                </li>

                                <li>
                                    <vs-button color="warning" type="filled" style="margin-left:10px;" @click="busquedaFiltroContenido();" icon="search"></vs-button>
                                </li>


                            
                            </ul>
                        </div>    
                    </vs-card>
                </vs-col>

           
    </vs-row>


    <div v-if="contenidos.length > 0">
        <vx-card title="Contenidos">
            <vs-table stripe max-items="10" search pagination :data="contenidos">
                <template slot="header">
                    <vs-button color="primary" type="border" @click="addNewData" icon-pack="feather" icon="icon-plus">Agregar</vs-button>
                    <p style="margin:0px 0px 0px 20px;"> 
                        <vs-chip transparent color="primary">
                            Cantidad:
                            <span style="font-weight:bold;margin-left:5px;"> {{ contenidos.length }}</span>
                        </vs-chip>
                
                    </p>
                </template>
            
                <template slot="thead">
                    <vs-th>Nombres</vs-th>
                    <vs-th>Temas</vs-th>
                    <vs-th>Asignatura</vs-th>
                    <vs-th>Unidad</vs-th>
                    <vs-th>Acciones</vs-th>
                </template>
                <template slot-scope="{data}">
                    <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                        <vs-td :data="tr.nombre">
                            <vs-list-item :subtitle="tr.nombre"></vs-list-item>
                        </vs-td>
                        <template v-if="tr.temas.length > 0">
                            <vs-td :data="tr.temas">
                                <vs-chip color="primary" :key="index" v-for="(item,index) in tr.temas">
                                    {{item.nombre_tema}}
                                </vs-chip>
                            </vs-td>
                        </template>
                        <template v-else>
                            <vs-td :data="tr.temas">
                                <vs-chip color="warning" active="true">
                                    Sin Temas
                                </vs-chip>
                            </vs-td>
                        </template>
                        <vs-td :data="tr.asignatura">
                            {{tr.asignatura}}
                        </vs-td>
                        <vs-td :data="tr.unidad">
                            {{tr.unidad}}
                        </vs-td>
                        <vs-td :data="tr">
                            <div class="flex">
                                <vs-button type="border" size="small" icon-pack="feather" icon="icon-edit" class="mr-2" color="success" @click="addNewDataEditar(tr)"></vs-button>
                                <vs-button type="border" size="small" icon-pack="feather" icon="icon-trash" class="mr-2" color="danger" @click="openConfirm(tr.idcontenido,tr.nombre)"></vs-button>
                            </div>
                        </vs-td>
                    </vs-tr>
                </template>
            </vs-table>
        </vx-card>
    </div>

    <div>
        <vs-card>
              <p>No hay contenidos</p>
        </vs-card>
      
    </div>
</div>
</template>

<script>
import {
    mapState
} from 'vuex'
import DataViewSidebar from './nuevo'
import DataViewSidebarEditar from './editar'
export default {
    components: {
        DataViewSidebar,
        DataViewSidebarEditar
    },
    computed: {
        ...mapState(['contenidos'])
    },
    data: () => ({
        valorBusqueda:'0',
        busqueda:"asignatura",
        razonBusqueda:"",
        sidebarData: {},
        sidebarDataEditar: {},
        addNewDataSidebar: false,
        addNewDataSidebarEditar: false,
        cont: {},
        id:0,
    }),
    mounted() {
      
    },
    methods: {
        busquedaFiltroContenido(){
            let me = this;
            
            localStorage.setItem('contenidoBusqueda',me.busqueda)
            localStorage.setItem('contenidorazonBusqueda',me.razonBusqueda)

            if(me.razonBusqueda.length < 4){
                  me.$vs.notify({
                  text:'Criterio de busqueda minimo 4 letras',
                  color:'warning',
                  iconPack: 'feather',
                  icon:'icon-check'})
                return false;
            }

            if(me.razonBusqueda.length > 25){
                  me.$vs.notify({
                  text:'Criterio de busqueda maximo 25 letras',
                  color:'warning',
                  iconPack: 'feather',
                  icon:'icon-check'})
                return false;
            }
            
            me.$store.dispatch('getContenido')
      
        },
        addNewData() {
            this.sidebarData = {}
            this.toggleDataSidebar(true)
        },
        addNewDataEditar(tr) {
            this.sidebarDataEditar = {}
            console.log(tr);
            this.cont = tr;
            this.toggleDataSidebarEditar(true)
        },
        toggleDataSidebar(val = false) {
            this.addNewDataSidebar = val
        },
        toggleDataSidebarEditar(val = false) {
            this.addNewDataSidebarEditar = val
        },

        openConfirm(id,nombre){
            let me  = this;
            me.id = id
  
            this.$vs.dialog({
                type:'confirm',
                color: 'danger',
                title: `Confirm`,
                text: 'Está seguro en eliminar este registro, el archivo '+nombre+' NO SERÁ ELIMINADO DEL SERVIDOR.',
                accept:this.getEliminar
            })
        },

        getEliminar(id) {
            let me = this;
            console.log(id)
            this.$http.delete(this.$server_url+"contenido/" + me.id)
            
                .then(function (response) {
                    me.$vs.notify({
                        color: 'warning',
                        text: 'Registro eliminado'
                    })
                    me.$store.dispatch('getContenido')
                })
                .catch(function (error) {})
        }
    },
}
</script>
