<template>
    <div>
        <div v-if="confirmar == true">
            <vs-card class="mt-2">
                <vs-alert title="Estas seguro de quitar todo?" color="danger">
                    <div class="flex">
                        <vs-button color="success" @click="f_quitarTodo()" type="relief">Si, Eliminar todo</vs-button>
                        <vs-button color="danger" class="ml-2" @click="cancelar()" type="relief">Cancelar</vs-button>
                    </div>
                </vs-alert>

            </vs-card>
        </div>
        <div v-else>
            <br/>
            <div class="m-2">
                <vs-list>
                    <vs-list-item v-if="show_inst== 'si'" title="Institución" :subtitle="p_user_institucion"></vs-list-item>
                    <vs-list-item title="Nombre" :subtitle="p_user_nombre"></vs-list-item>
                    <vs-list-item title="Email" :subtitle="p_user_email"></vs-list-item>
                </vs-list>
                <vs-divider color="success">Areas seleccionadas ( {{seleccionadas.length}} ) </vs-divider>
                <vs-collapse>
                    <vs-collapse-item icon-pack="feather" icon-arrow="icon-arrow-down">
                        <div slot="header">
                            Ver ( {{seleccionadas.length}} )
                        </div>
                        <div class="vx-row">
                            <div class="vx-col sm:w-full text-right" v-if="seleccionadas.length >1">
                                <vs-button type="border" color="danger" size="small" @click="confirmaQuitar()">Quitar todas <span class="feather icon icon-trash"></span></vs-button>
                            </div>
                            <div class="vx-col sm:w-full">
                                <div v-for="(item, index) in seleccionadas" :key="index" class="m-1 p-1 asig-select text-dark">
                                    {{item.nombreasignatura}} &nbsp; &nbsp;
                                    <vs-button @click="eliminaAsignacion(item)" style="display:inline" size="small" color="danger" radius type="border" icon-pack="feather" icon="icon-trash"></vs-button>
                                </div>
                            </div>
                        </div>
                    </vs-collapse-item>
                </vs-collapse>
            </div>
            <div class="m-2">
                <vs-divider color=primary> Areas ( {{area.length}} ) </vs-divider>
                <vs-collapse>
                    <vs-collapse-item icon-pack="feather" icon-arrow="icon-arrow-down" v-for="(listItem, index) in area" :key="index" :title="listItem.name">
                        <div slot="header">
                            {{listItem.name}}
                        </div>
                        <vs-button v-for="(listIAsig, indexAsig) in listItem.children" :key="indexAsig" type="border" color="primary" class="p-2 m-1" @click="agregaAsignacion(listIAsig)">
                            {{listIAsig.name}}
                        </vs-button>
                    </vs-collapse-item>
                </vs-collapse>
            </div>
        </div>

    </div>
</template>
<script>
export default {
    data() {
      return{
            asignaturadocenteselect: [],
            seleccionadas: '',
            usuarioAsignacion: '',
            user_seleccionado: '',
            user_nombre: '',
            user_email: '',
            seleccionadas:[],
            area:[],
            usuario:[],
            show_inst: '',
            confirmar:false,
      }
    },
    props:{
        p_user_nombre:{
            type:String,
            default:'0'
        },
        p_user_email:{
            type:String,
            default:'0'
        },
        p_user_institucion:{
            type:String,
            default:'0'
        },


    },
    created(){
        let me = this;
        me.usuario = JSON.parse(localStorage.getItem("usuario"))
        me.getSeleccionadas()
        me.getAreaSelect();
        me.usuarioAsignacion = me.datos;
        // me.usuarioAsignacion = JSON.parse(localStorage.getItem('user_select'));
        me.user_seleccionado = me.usuarioAsignacion.idusuario

    },
    methods:{
        getSeleccionadas() {
            let me = this;
            me.$vs.loading();
            let data = new FormData();
            data.append('idusuario', localStorage.user_seleccionado)
            this.$http.post(this.$server_url + "asignaturasDocent", data)
                .then(res => {
                    // console.log(res.data);
                    me.seleccionadas = res.data;
                    localStorage.setItem('aSeleccionadas',JSON.stringify(res.data))
                    // me.popupDocentes = true;
                    me.$vs.loading.close();
                })
                .catch(function(e){
                    me.$vs.loading.close();
                })

            // me.$vs.loading();
            // this.$http.get(this.$server_url + "getasignaturasDocente?idusuario="+localStorage.user_seleccionado).then(function (response) {
            //      me.seleccionadas = res.data;
            //     localStorage.setItem('aSeleccionadas',JSON.stringify(me.area))
            //     // console.log(me.area);
            //     me.$vs.loading.close();
            // })
            // .catch(function(e){
            //     me.$vs.loading.close();
            //  });
        },
        getAreaSelect() {
            let me = this;
            me.$vs.loading();
            this.$http.get(this.$server_url + "areaSelect").then(function (response) {
                me.area = response.data.items;
                localStorage.setItem('areasSeleccionadas',JSON.stringify(me.area))
                // console.log(me.area);
                me.$vs.loading.close();
            });
        },
           agregaAsignacion(item) {
            let me = this;
            let data = new FormData();
            data.append('usuario_idusuario', localStorage.user_seleccionado)
            data.append('asignatura_idasignatura', item.id)
            this.$http.post(this.$server_url + "asignar_asignatura_docentes", data)
                .then(function (res) {
                    // console.log(res.data);
                    if (res.data > 0) {
                        me.$vs.notify({
                            time: 7000,
                            text: 'Esta asignatura ya se encuentra asignada al docente',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        })
                    } else {
                        me.$vs.notify({
                            text: 'Asignatura agregada',
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-check'
                        })
                        me.getSeleccionadas();
                    }
                    me.$vs.loading.close();
                });
        },
        eliminaAsignacion(item) {
            let me = this;
            // console.log(item)
            me.$vs.loading();
            this.$http.get(this.$server_url + "eliminaAsignacion/" + item.idasignado)
                .then(function (res) {
                    // console.log(res.data);
                    me.$vs.notify({
                        text: item.nombreasignatura + ' eliminada',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                    me.getSeleccionadas();
                    me.$vs.loading.close();
                });
        },

        confirmaQuitar() {
            let me = this;
            me.confirmar = true
            // me.$vs.dialog({
            //     type: 'confirm',
            //     color: 'danger',
            //     title: 'Confirmar',
            //     text: '¿Está seguro de eliminar este contenido?',
            //     acceptText: 'Aceptar',
            //     cancelText: 'Cancelar',
            //     cancel:me.cancelar,
            //     accept: me.f_quitarTodo
            // })
        },
        cancelar(){
            let me = this;
            me.confirmar = false
        },
        f_quitarTodo() {
            let me = this;
            me.confirmar = false
            let idSelects = [];
            for (let index = 0; index < me.seleccionadas.length; index++) {
                idSelects.push(me.seleccionadas[index].idasignado)
            }
            // console.log(idSelects)
            me.$vs.loading();
            let data = new FormData();
            data.append('idasiguser', idSelects)
            this.$http.post(this.$server_url + "quitaTodasAsignaturas", data)
                .then(function (res) {
                    // console.log(res.data);
                     me.$vs.notify({
                        text: 'Asignaturas quitadas correctamente.',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                    me.getSeleccionadas();
                    me.$vs.loading.close();
                });
        },

    }
}
</script>
