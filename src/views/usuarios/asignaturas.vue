<template>
<vx-card>
    <div class="m-2">
        <vs-list>
            <vs-list-item v-if="show_inst== 'si'" title="Institución" :subtitle="user_institucion.nombreInstitucion"></vs-list-item>
            <vs-list-item title="Nombre" :subtitle="user_nombre"></vs-list-item>
            <vs-list-item title="Email" :subtitle="user_email"></vs-list-item>
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
</vx-card>
</template>

<script>
export default {
    props: {},
    data() {
        return {
            area: [],
            asignaturadocenteselect: [],
            seleccionadas: '',
            usuario: '',
            user_seleccionado: '',
            user_nombre: '',
            user_email: '',
            user_institucion: '',
            show_inst: '',
        }
    },
    mounted() {
        let me = this;
        me.show_inst = (localStorage.getItem('show_inst'));
        me.usuario = JSON.parse(localStorage.getItem('user_select'));
        me.user_seleccionado = me.usuario.idusuario
        me.user_nombre = me.usuario.nombres + ' ' + me.usuario.apellidos
        me.user_email = me.usuario.email
        me.user_institucion = JSON.parse(localStorage.getItem('institucion'))
        me.getAreaSelect();
        me.getSeleccionadas();
        // if (me.idusuario) {
        //     me.asignatura(me.idusuario)
        // }
    },
    methods: {
        getSeleccionadas() {
            let me = this;
            me.$vs.loading();
            let data = new FormData();
            data.append('idusuario', me.user_seleccionado)
            this.$http.post(this.$server_url + "asignaturasDocent", data)
                .then(res => {
                    // console.log(res.data);
                    me.seleccionadas = res.data;
                    me.$vs.loading.close();
                });
        },
        getAreaSelect() {
            let me = this;
            me.$vs.loading();
            this.$http.get(this.$server_url + "areaSelect").then(function (response) {
                me.area = response.data.items;
                // console.log(me.area);
                me.$vs.loading.close();
            });
        },

        agregaAsignacion(item) {
            let me = this;
            let data = new FormData();
            data.append('usuario_idusuario', me.user_seleccionado)
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
            me.$vs.dialog({
                type: 'confirm',
                color: 'danger',
                title: 'Confirmar',
                text: '¿Está seguro de eliminar este contenido?',
                acceptText: 'Aceptar',
                cancelText: 'Cancelar',
                accept: me.f_quitarTodo
            })
        },
        f_quitarTodo() {
            let me = this;
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
        }
    },
}
</script>

<style lang="css">
.asig-select {
    display: inline-block;
    border: 0.7px solid rgb(201, 201, 204);
    border-radius: 6px;
    font-size: 12px;
}
</style>
