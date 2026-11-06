<template>
    <div>
        <vs-card>
            xf
            <vs-table max-items="10" search pagination :data="Recursos">
                <template slot="header">
                    <div class="flex">
                        <vs-chip color="primary">Cantidad: {{Recursos.length}}</vs-chip> 
                        <vs-button class="ml-4" color="success" @click="limpiar();popupAdd = true;title='Agregar recurso';" type="line" icon="add">Añadir</vs-button>   
                    </div>
                </template>
                <template slot="thead">
                        <vs-th>Id</vs-th>
                        <vs-th>Descripcion</vs-th>
                        <vs-th>Acciones</vs-th>
                    </template>
                    <template slot-scope="{data}">
                        <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                            <vs-td>
                                {{data[indextr].id}}<br>
                            </vs-td>
                            <vs-td>
                                {{data[indextr].descripcion}}<br>
                            </vs-td>
                            <vs-td>
                                <div style="display: flex;">
                                    <vx-tooltip style="display: inline-block;" text="Editar recurso" position="top" color="primary">
                                        <vs-button radius color="success" @click="openEditRecurso(tr);title='Editar recurso'" type="line" icon="edit"></vs-button>
                                    </vx-tooltip> &nbsp; 
                                    <vx-tooltip style="display: inline-block;" text="Eliminar recurso" position="top" color="primary">
                                        <vs-button radius color="danger" @click="openConfirm(tr)" type="line" icon="delete"></vs-button>
                                    </vx-tooltip> &nbsp; 
                                </div>
                            </vs-td>           
                        </vs-tr>
                    </template>
                </vs-table>
        </vs-card>
        <!--MODALES-->
        <vs-popup
            background-color="rgba(255,255,255,.6)"
            :title="title" :active.sync="popupAdd">
            <vs-row>
                <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                   <vs-input class="w-full" label="Ingrese el recurso" placeholder="recurso" v-model="recurso"/>
                </vs-col>
            </vs-row> 
            <vs-row>
                <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                   <vs-button class="mt-4" type="relief" @click="addRecurso()">Guardar</vs-button>
                </vs-col>
            </vs-row>     
        </vs-popup>
    </div>
</template>

<script>
export default {
    data() {
       return{
           Recursos:[],
           popupAdd:false,
           recurso:'',
           id:0,
           title:''
       } 
    },
    created(){
        let me = this;
        me.getRecursos()
    },
    methods:{
        getRecursos() {
            let me = this;
            me.$vs.loading();
            this.$http.get(this.$server_url+'historico?traerRecursos=yes')
                .then(function (res) {
                    me.Recursos = res.data
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()

                })
        },
         //para agregar el recurso
         addRecurso() {
            let me = this;
            if(me.recurso.split() == ''){
                me.$vs.notify({
                text:'Debe ingresar un recurso para guardar',
                color:'warning',
                iconPack: 'feather',
                icon:'icon-check'})
                return false
            }
            let formData = new FormData();
            formData.append('id',           me.id);
            formData.append('descripcion', me.recurso);   
            me.$vs.loading()
            this.$http.post(this.$server_url+'HistoricoRecursos', formData)
            .then(res => {
                me.getRecursos();
                me.$vs.loading.close()
                me.$vs.notify({
                text:'Recurso guardado con exito',
                color:'success',
                iconPack: 'feather',
                icon:'icon-check'})
                me.popupAdd = false
                me.limpiar()
            })
            .catch(function(e){
                me.$vs.loading.close()
                me.$vs.notify({
                text:'No se pudo guardar el recurso',
                color:'danger',
                iconPack: 'feather',
                icon:'icon-check'})
            })
        },
        openEditRecurso(tr){
            let me = this;
            me.id = tr.id
            me.recurso = tr.descripcion
            me.popupAdd = true;
        },
        openConfirm(tr){
            let me = this;
            me.id = tr.id
            this.$vs.dialog({
                type:'confirm',
                color: 'danger',
                title: `Confirmar`,
                text: 'Estas seguro de eliminar el recurso',
                accept:this.eliminarRecurso
            })
        },
         //para agregar el recurso
        eliminarRecurso() {
            let me = this;
            let formData = new FormData();
            formData.append('id',           me.id);
            formData.append('eliminar',     "yes");
            me.$vs.loading()
            this.$http.post(this.$server_url+'HistoricoRecursos', formData)
            .then(res => {
                me.getRecursos();
                me.$vs.loading.close()
                me.$vs.notify({
                text:'Recurso eliminado con exito',
                color:'success',
                iconPack: 'feather',
                icon:'icon-check'})
            })
            .catch(function(e){
                me.$vs.loading.close()
                me.$vs.notify({
                text:'No se pudo eliminar el recurso',
                color:'danger',
                iconPack: 'feather',
                icon:'icon-check'})
            })
        },

        limpiar(){
           let me = this;
           me.recurso = ""
           me.id      = 0
        }
    }
}
</script>