<template>
<div>
    <vs-card>
        <div class="vx-row m-2">
            <div class="vx-col w-full mb-base" align="left">
                <div style="font-size: 12px;">Cargar Archivo </div>
                <upload class="w-full flex justify-center" v-on:file="info"></upload>
            </div>
            <div class="vx-col w-full" align="left">
                <div style="font-size: 12px; ">Asignatura: </div>
                <v-select class="mb-4 w-full" v-model="planificacion.asignatura_idasignatura" :options="asignaturas" label="nombreasignatura" :reduce="asignaturas => asignaturas.idasignatura" />
            </div>
            <div class="vx-col w-full" align="left">
                <div style="font-size: 12px;">Nombre: </div>
                <vs-input type="text" class="inputx w-full mb-6" v-model="planificacion.nombreplanificacion" maxlength="300" placeholder="nombre" />
            </div>
            <div class="vx-col w-full" align="left">
                <div style="font-size: 12px;">Descripcion </div>
                <vs-input type="text" class="inputx w-full mb-6" v-model="planificacion.descripcionplanificacion" maxlength="350" placeholder="descripcion" />
            </div>
            <div class="vx-col w-full mb-base" align="left">
                <div style="font-size: 12px;">Estado </div>
                <vs-radio v-model="planificacion.Estado_idEstado" vs-name="radioEstado" class="m-2" vs-value="1">Activo</vs-radio>
                <vs-radio v-model="planificacion.Estado_idEstado"  vs-name="radioEstado" class="m-2" color="danger" vs-value="2">Inactivo</vs-radio>
            </div>
            <div class="vx-col w-full flex justify-end">
                <vs-button style="display:inline" class="m-2 mb-2 uppercase" type="filled" @click="guardar()"> Guardar </vs-button>
            </div>
        </div>
    </vs-card>
</div>
</template>

<script>
import vSelect from 'vue-select'
import upload from '../../components/upload/upload.vue'
export default {
    data() {
        return {
            planificacion: {
                Estado_idEstado:'1',
                asignatura_idasignatura:'',
                descripcionplanificacion:'',
                nombreplanificacion:'',
                user_created:''
            },
            limiteMegas: 5,
            bytes: 1048576,
            msjError: 'El peso del archivo excede el limite permitido, verifique antes de continuar',
            usuario:'',
            porcentaje1: '',
            pesoArchivo1: '',
            muyPesado1: '',
            msj1: '',
            file1: '',
            asignaturas: []
        }
    },
    components: {
        'v-select': vSelect,
        upload
    },
    mounted() {
        this.getAsignaturas()
        this.usuario = JSON.parse(localStorage.getItem('usuario'));
    },
    methods: {
        info(item) {
            console.log('rr',item)
            this.planificacion.idplanificacion = item.idplanificacion
            this.planificacion.nombreplanificacion = item.nombre
            this.planificacion.descripcionplanificacion = item.nombre
        },
       
        getAsignaturas() {
            let me = this;
            this.$http.get(this.$server_url + 'asignaturas')
                .then(res => {
                    me.asignaturas = res.data
                    // console.log(res.data)
                })
                .catch(error => {
                    console.log(error)
                })
        },
        guardar() {
            let me = this;
            if(me.planificacion.asignatura_idasignatura == null || me.planificacion.asignatura_idasignatura == undefined || me.planificacion.asignatura_idasignatura == ""){
                  me.$vs.notify({
                  text:'Tiene que seleccionar una asignatura',
                  color:'warning',
                  iconPack: 'feather',
                  icon:'icon-check'})
                return false
            }
            me.$vs.loading();
            let formData = new FormData();
            formData.append('idplanificacion', me.planificacion.idplanificacion);
            formData.append('Estado_idEstado', me.planificacion.Estado_idEstado);
            formData.append('asignatura_idasignatura', me.planificacion.asignatura_idasignatura);
            formData.append('descripcionplanificacion', me.planificacion.descripcionplanificacion);
            formData.append('nombreplanificacion', me.planificacion.nombreplanificacion);
            formData.append('user_created', me.usuario.idusuario);
            this.$http.post(this.$server_url + 'planificaciones', formData)
                .then(res => {
                    me.$vs.loading.close();
                    var item = {}
                    item.planificacion = {}
                    item.menu = {
                        plista: true,
                        pnuevo: false,
                        peditar: false
                    }
                    me.$emit('item', item)
                })
                .catch(e => {
                    console.log(e)
                    me.$vs.loading.close();
                })
        },
    },
}
</script>
