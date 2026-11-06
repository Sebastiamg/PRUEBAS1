<template>
    <div>
        <section>
            <vs-table max-items="20" search pagination :data="listaDatos">
                <template slot="header">
                    <span>Cantidad: {{ listaDatos.length}} </span>
                </template>
                <template slot="thead">
                    <vs-th>#</vs-th>
                    <vs-th>Asignatura</vs-th>
                    <vs-th>Titulo</vs-th>
                    <vs-th>Archivos</vs-th>
                    <vs-th v-if="!userEstudiante">Acciones</vs-th>
                </template>
                <template slot-scope="{data}">
                    <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                        <vs-td>
                            {{ tr.id }}<br>
                        </vs-td>
                        <vs-td>
                            <b>Asignatura:</b>
                            <p>{{ tr.nombreasignatura }}</p>
                            <span><b>Unidad: </b>{{ tr.id_unidad }}</span>
                            <p></p>
                            <vs-chip color="primary" v-if="tr.estado == 1">Activo</vs-chip>
                            <vs-chip color="warning" v-if="tr.estado == 0">Inactivo</vs-chip>
                        </vs-td>
                        <vs-td>
                            <b>Título:</b>
                            <p>{{ tr.titulo }}</p>
                            <b>Fecha:</b>
                            <p>{{ tr.created_at | fecha }}</p>
                            <vs-chip color="primary" v-if="tr.tipo == 1">Con guía</vs-chip>
                            <vs-chip color="warning" v-if="tr.tipo == 0">Sin guía</vs-chip>
                        </vs-td>
                        <vs-td>
                            <div v-if="tr.files.length > 0" v-for="(item,key2) in tr.files" :key="key2">
                                <p class="imagen" @click="documento=item.url;openDocument(item)">
                                    <b> {{ item.archivo }}
                                        <!--IMAGE-->
                                        <ion-icon v-if="item.url.substr(-3) == 'png' || item.url.substr(-3) == 'jpg' || item.url.substr(-3) == 'PNG'" style="font-size:20px;color:green;position:relative;top:5px;" name="camera-outline"></ion-icon>
                                        <!--PDF-->
                                        <ion-icon v-else style="font-size:20px;color:green;position:relative;top:5px;" name="document-outline"></ion-icon>
                                    </b>
                                </p>
                            </div>
                        </vs-td>
                        <vs-td v-if="!userEstudiante">
                            <div v-if="userDocente">
                                <vx-tooltip v-if="tr.tipo == 0" style="display: inline-block;" text="Asignar cursos" position="top" color="warning">
                                    <vs-button size="large" radius icon-pack="feather" icon="icon-folder" @click="ficha = tr;getCursosDocente();" color="warning" type="line"></vs-button>
                                </vx-tooltip>
                            </div>
                            <div v-if="userAdmin">
                                <vs-button class="inline m-2" type="line" radius color="primary" icon="edit" @click="feditar(tr)" />
                                <vs-button class="inline m-2" type="line" radius color="danger" icon="delete" @click="ficha = tr;f_confirmarDelete(tr)" />
                            </div>
                        </vs-td>
                    </vs-tr>
                </template>
            </vs-table>
        </section>
        <!--MODAL PARA MOSTRAR DOCUMENTO-->
        <vs-popup class="holamundo" :title="'Ver archivo'" fullscreen :active.sync="popupDocumento">
            <div class="flex" style="justify-content: center;">
                <image-zoom 
                    :regular="$data_url+'archivos/fichas'+'/'+documento"
                    :zoom-amount="3"
                    :click-zoom="true"
                    click-message="De click para aumentar"
                    img-class="img-fluid"
                    >				
                </image-zoom>
            </div>
        </vs-popup>
        <!--MODAL PARA ASIGNAR CURSO LA FICHA-->
        <vs-popup title="Seleccione un curso" :active.sync="modalAsignarCurso">
        <vs-list>
            <vs-list-item v-for="(item,$index) in cursosDocente" :key="$index" :title="item.nombre" :subtitle="item.codigo">
                <template slot="avatar">
                    <vs-avatar color="primary" icon-pack="feather" icon="icon-folder" />
                </template>
                <vs-chip color="warning" v-if="item.getCurso.length > 0" class="mt-1">Ya esta asignado</vs-chip>
                
                <vs-button class="m-1" v-if="item.getCurso.length > 0" style="padding: 7px 5px 7px 5px; font-size: 12px;" size="small" type="filled" target="_blank" color="danger" @click="eliminarAsignacion(item)">Eliminar asignación</vs-button>
                <vs-button class="m-1" v-else style="padding: 7px 5px 7px 5px; font-size: 12px;" size="small" type="filled" target="_blank" color="success" @click="asignarCurso(item)">Asignar ficha</vs-button>
            </vs-list-item>
        </vs-list>
    </vs-popup>
    </div>
</template>
<script>
import axios from 'axios'
import imageZoom from 'vue-image-zoomer';
export default{
    data(){
        return{
            usuario:[],
            userAdmin:false,
            userDocente:false,
            userEstudiante:false,
            //variables files
            popupDocumento:false,
            documento:'',
            //fin variables files
            //variables para asignar ficha a curso
            cursosDocente:[],
            modalAsignarCurso:false,
            ficha:{},
            //fin variables para asignar ficha a curso
        }
    },
    created() {
        let me = this;
        me.usuario = JSON.parse(localStorage.getItem("usuario"))
    },
    mounted(){
        let me = this;
        if(me.usuario.id_group == 1) me.userAdmin   = true
        if(me.usuario.id_group == 6) me.userDocente = true
        if(me.usuario.id_group == 4) me.userEstudiante = true
    },
    props:{
        listaDatos:{
            type:Array,
            default:[],
            ficha:{},
        }
    },
    components:{
        imageZoom,
    },
    methods:{
        feditar(tr){
            let me = this
            me.$emit('changeEdit',tr)
        },
        f_confirmarDelete(tr){
            this.$vs.dialog({
                type:'confirm',
                color: 'danger',
                acceptText:'Si, deseo eliminar',
                cancelText:'Cancelar',
                title: `Confirmar`,
                text: 'Estas seguro de eliminar la ficha?',
                accept:this.deleteFicha
            })
        },
        deleteFicha(){
            let me = this;
            let formData = new FormData();
            formData.append('id',me.ficha.id);
            me.$vs.loading()
            axios.post(this.$data_url + 'api/eliminarFicha', formData)
            .then(res => {
            me.$vs.loading.close()
            me.$emit('recharge',true)
            me.$vs.notify({
                text:'Ficha eliminada correctamente',
                color:'success',
                iconPack: 'feather',
                icon:'icon-check'})
            })
            .catch((e) =>{
                me.$vs.loading.close()
            })
        },
        //metodos files
        openDocument(item){
            let me = this;
            if (item.url.substr(-3) == "pdf") {
                window.open(this.$data_url+'archivos/fichas/' + me.documento, '_blank');
                return
            } else if ( item.url.substr(-3) == "doc" || item.url.substr(-3) == "ocx" || item.url.substr(-3) == "xls" || item.url.substr(-3) == "lsx" ) {
                window.open('https://view.officeapps.live.com/op/embed.aspx?src='+this.$data_url+'archivos/proyectos/' + item.url, '_blank');
                return
            }
            me.popupDocumento = true;
        },
        //fin metodos files
        //metodos docentes
        getCursosDocente() {
            let me = this
            me.$vs.loading()
            this.$http.get(this.$server_url+'cursoDocentesFicha?id_usuario='+me.usuario.idusuario+'&id_asignatura='+localStorage.idasignatura+'&periodo_id='+localStorage.periodo_id+'&ficha_id='+me.ficha.id)
                .then(function (res) {
                    me.$vs.loading.close()
                    me.cursosDocente        = res.data
                    me.modalAsignarCurso    = true
                })
                .catch(function (error) { me.$vs.loading.close() })
        },
        asignarCurso(item) {
            let me = this;
            if (me.usuario.id_group == 10) {
                me.$vs.notify({
                    text: 'Este contenido pertenece a otro docente',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-check'
                })
                return;
            }
            let formData = new FormData();
            formData.append('codigo_curso', item.codigo);
            formData.append('ficha_id',     me.ficha.id);
            formData.append('periodo_id',   localStorage.periodo_id)
            this.$http.post(this.$server_url+'fichas', formData)
                .then(function (res) {
                    me.$vs.notify({
                        text: res.data.message,
                        color: 'primary',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                    me.getCursosDocente(item)
                })
                .catch(function (error) {})
        },
        eliminarAsignacion(item){
            let me = this;
            let formData = new FormData();
            formData.append('codigo_curso', item.codigo);
            formData.append('ficha_id',     me.ficha.id);
            this.$http.post(this.$server_url+'eliminarAsignacionFicha', formData)
                .then(function (res) {
                    me.$vs.notify({
                        text: 'Se quito la asignación al curso correctamente',
                        color: 'primary',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                    me.getCursosDocente(item)
                })
                .catch(function (error) {})
        },
        //fin metodos docentes
    }
}
</script>
<style scoped>
.imagen{
    cursor:pointer;
    opacity:0.8;
    transition: 1s ease all;
}
.imagen:hover{
    text-decoration: underline;
    color:#217bc5;
    text-shadow:2px 4px 2px #ccc;
}
</style>