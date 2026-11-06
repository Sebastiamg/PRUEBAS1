<template>
    <div>
        <p class="mt-2 ml-2 font-medium text-2xl text-opacity-25">Solicitudes</p>
        <vs-divider></vs-divider>
        <div class="flex" style="flex-wrap:wrap;">
            <div class="sm:w-full md:w-1/2  p-2 bg-gray-400 text-center">
                <vs-list>
                    <vs-list-header icon-pack="feather" icon="icon-users" title="Docentes"></vs-list-header>
                    <vs-list-item class="docente" v-for="(item,key) in arregloSolicitudes" :key="key" icon-pack="feather" :icon="item.estado == 1?'icon-bell':''" :title="item.profesor" :subtitle="item.nombreInstitucion">
                        <vs-button color="rgb(11, 189, 135)" class="ml-2" size="small" @click="traerLibros(item)" type="border">
                            REVISAR
                        </vs-button>
                    </vs-list-item> 
                </vs-list>
            </div>
            <div class=" sm:w-full md:w-1/2   p-2 bg-gray-500 text-left ">
                <vs-table search :data="arregloLibrosSolicitud" stripe pagination max-items="5">
                    <template>
                    <div slot="header">
                       <vs-alert><small>Docente:</small> <span class="font-bold" style="font-size:12px;">{{ maestro.nombre }}</span></vs-alert>
                    </div>
                    </template>
                    <template slot="thead">
                        <vs-th sort-key="nombrelibro">Libro</vs-th>
                        <vs-th sort-key="nombrelibro">Serie</vs-th>
                        <vs-th sort-key="nombrelibro">Estado</vs-th>
                        <vs-th sort-key="nombrelibro">Acciones</vs-th>
                    </template>
                    <template slot-scope="{data}">
                    <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                        <vs-td :data="data[indextr].nombrelibro">
                            <span>{{ tr.nombrelibro }}</span>
                        </vs-td>
                        <vs-td :data="data[indextr].serie">
                            <span>{{ tr.serie }}</span><br>
                        </vs-td>
                        <vs-td>
                            <vs-chip color="warning" v-if="tr.estado == 0">
                            Sin aprobar
                            </vs-chip>
                            <vs-chip color="success" v-if="tr.estado == 1">
                            Aprobado
                            </vs-chip>
                        </vs-td>
                        <vs-td>
                        <div class="flex"> 
                            <vx-tooltip v-if="tr.estado !=1" style="display: inline-block;" text="Aprobar libro" position="top" color="success">
                                <vs-button size="small" class="modal-default-button" color="success" @click="agregaAsignacion(data[indextr])" type="line" icon-pack="feather" icon="icon-check">
                                </vs-button>
                            </vx-tooltip>
                        </div>
                        </vs-td>
                    </vs-tr>
                    </template>
                </vs-table>
            </div>
        </div>
        <p class="mt-2 ml-2 font-medium text-2xl">Libros aprobados</p>
        <vs-divider></vs-divider>
            <div class="w-full p-2 bg-gray-400 text-left">
                <vx-card
                :title="maestro.nombre"
                title-color="success"
                :subtitle="'Cantidad: '+arregloLibrosAprobados.length"
                 class="w-full p-2 bg-gray-500 text-left ml-2"
                 >
                    <vs-table search :data="arregloLibrosAprobados" stripe pagination max-items="20">
                        <template>
                        </template>
                        <template slot="thead">
                            <vs-th sort-key="nombrelibro">Libro</vs-th>
                            <vs-th sort-key="nombrelibro">Fecha de aprobacion</vs-th>
                            <vs-th sort-key="nombrelibro">Acciones</vs-th>
                        </template>
                        <template slot-scope="{data}">
                        <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                            <vs-td :data="data[indextr].nombreasignatura">
                                <span>{{ tr.nombreasignatura }}</span>
                            </vs-td>
                            <vs-td :data="data[indextr].created_at">
                                <span>{{ tr.created_at }}</span><br>
                            </vs-td>
                            <vs-td>
                                <vx-tooltip class="ml-3" style="display: inline-block;" text="Eliminar" position="top" color="success">
                                    <vs-button size="small" class="modal-default-button" color="danger" @click="openConfirm(data[indextr])" type="line" icon-pack="feather" icon="icon-trash">
                                    </vs-button>
                                </vx-tooltip>
                            </vs-td>
                            <!-- <vs-td>
                                <vs-chip color="warning" v-if="tr.estado == 0">
                                Sin aprobar
                                </vs-chip>
                                <vs-chip color="success" v-if="tr.estado == 1">
                                Aprobado
                                </vs-chip>
                            </vs-td> -->
                        </vs-tr>
                        </template>
                    </vs-table>
                </vx-card>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return{
            arregloSolicitudes:[],
            arregloLibrosSolicitud:[],
            arregloLibrosAprobados:[],
            maestro:{
                id:'',
                idusuario:'',
                nombre:''
            },
            itemEliminar:{
                id:'',
                nombreasignatura:'',
                idusuario:'',
            }
        }
    },
    props:{
        id:{
            type:Number,
            default:0
        }
    },
    mounted(){
        let me = this;
        me.getSolicitudes();
    },
    methods:{
        //para obtener las solicitudes de los docentes
        getSolicitudes() {
            let me = this;
            this.$http.get(this.$server_url+'formularioDocente?maestroSolicitudes=yes&id='+me.id)
                .then(function (res) {
                   me.arregloSolicitudes = res.data
                //    me.arregloAprobado    = res.data.filter(p => p.estado != '1')
                })
                .catch(function (error) {
                    console.log(error + ' error');
                })
        },
        traerLibros(tr){
            let me = this;
            me.maestro.id        = tr.id
            me.maestro.nombre    = tr.profesor
            me.maestro.idusuario = tr.idusuario
            this.$http.get(this.$server_url+'formularioDocente?getMaestroLibros=yes&id='+tr.id)
                .then(function (res) {
                    me.arregloLibrosSolicitud = res.data
                //    me.arregloLibrosSolicitud = res.data.filter(p => p.estado == '0')
                   me.getLibrosAprobados(tr.idusuario)
                })
                .catch(function (error) {
                    console.log(error + ' error');
                })
        },
        getLibrosAprobados(idusuario){
            let me = this;
            me.arregloLibrosAprobados = []
            this.$http.get(this.$server_url+'formularioDocente?getLibrosAprobados=yes&idusuario='+idusuario)
                .then(function (res) {
                   me.arregloLibrosAprobados = res.data
                })
                .catch(function (error) {
                    console.log(error + ' error');
                })
        },
        agregaAsignacion(item) {
            let me = this;
            let data = new FormData();
            me.$vs.loading()
            data.append('usuario_idusuario', me.maestro.idusuario)
            data.append('asignatura_idasignatura', item.asignatura_idasignatura)
            this.$http.post(this.$server_url + "asignar_asignatura_docentes", data)
                .then(function (res) {
                        me.$vs.notify({
                            text: 'Asignatura agregada',
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-check'
                        })
                        me.getActualizarLibro(item.id);
                        me.getLibrosAprobados(me.maestro.idusuario)
                        me.getSolicitudes()
                        me.getLibros(me.maestro.id)
                    me.$vs.loading.close();
                })
                .catch(function (error) {
                     me.$vs.loading.close();
                });
        },
        openConfirm(tr){
            let me = this;
            me.itemEliminar.id               = tr.idasiguser
            me.itemEliminar.nombreasignatura = tr.nombreasignatura
            me.itemEliminar.idusuario        = tr.usuario_idusuario
            this.$vs.dialog({
                type:'confirm',
                color: 'danger',
                title: `Confirmar`,
                text: 'Estas seguro de eliminar este libro?',
                accept:this.eliminaAsignacion
            })
        },
        eliminaAsignacion() {
            let me = this;
            // console.log(item)
            me.$vs.loading();
            this.$http.get(this.$server_url + "eliminaAsignacion/" + me.itemEliminar.id)
                .then(function (res) {
                    me.$vs.notify({
                        text: me.itemEliminar.nombreasignatura + ' eliminada',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                    me.getLibrosAprobados(me.itemEliminar.idusuario);
                    me.$vs.loading.close();
                });
        },
        getActualizarLibro(id){
            let me = this;
            this.$http.get(this.$server_url+'formularioDocente?actualizarLibro=yes&id='+id+'&solicitud_id='+me.maestro.id)
                .then(function (res) {
                })
                .catch(function (error) {
                    console.log(error + ' error');
                })
            
        },
        getLibros(id){
            let me = this;
            me.arregloLibrosSolicitud = []
            this.$http.get(this.$server_url+'formularioDocente?getMaestroLibros=yes&id='+id)
                .then(function (res) {
                   me.arregloLibrosSolicitud = res.data
                })
                .catch(function (error) {
                    console.log(error + ' error');
                })
        },
    }
}
</script>
<style scoped>
.docente:hover{
    background-color: #E4EAF1;
    transition: 3s ease;
    cursor: pointer;
}
</style>