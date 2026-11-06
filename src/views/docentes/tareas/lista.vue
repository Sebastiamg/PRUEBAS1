<template>
<div>
    <div>
        <vs-table :key="'tabla-tareas-' + tareas.length" max-items="10" search pagination :data="tareas">
            <template slot="thead">
                <vs-th>Id</vs-th>
                <vs-th>Nombre</vs-th>
                <vs-th sort-key="descripcion">Descripción</vs-th>
                <vs-th sort-key="fecha_inicio">Fecha</vs-th>
                <vs-th>Detalle</vs-th>
                <vs-th></vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td :data="tr.tarea.nombre">
                        T{{indextr}}
                    </vs-td>
                    <vs-td :data="tr.tarea.nombre">
                        <a :href="$data_url+'tareas/'+tr.tarea.url" :download="tr.tarea.nombre" rel="noopener noreferrer">
                            <div v-if="tr.tarea.nombre != null">
                                <span v-if="tr.tarea.nombre.length<35">{{ tr.tarea.nombre}}</span>
                                <span v-else>{{ tr.tarea.nombre.substring(25,0)}}....</span>
                            </div>
                        </a>
                    </vs-td>
                    <vs-td :data="tr.tarea.descripcion">
                        {{tr.tarea.descripcion}}<br>
                        <div v-if="tr.tarea.usuario_idusuario===null">
                            <span style="font-size: 13px;">Tarea para todo el curso</span>
                        </div>
                        <div v-else style="color: #ECA100;">
                            <span style="font-size: 13px;">Tarea para: {{ tr.tarea.nombres_estudiante }}</span>
                        </div>
                    </vs-td>
                    <vs-td :data="tr.tarea.fecha_inicio">
                        {{tr.tarea.fecha_inicio}}<br>
                        {{tr.tarea.fecha_final}}
                    </vs-td>
                    <vs-td class="text-center" :data="tr.respuesta">
                        <div class="flex">
                            <ul>
                                <li>
                                    Tareas Entregadas {{tr.total[0]['cantidad']}}
                                </li>
                                <li>
                                    Tareas Calificadas 0
                                </li>
                            </ul>
                        </div>
                    </vs-td>
                    <vs-td class="text-center" :data="tr.tarea">
                        <div class="flex">
                            <vx-tooltip style="display: inline-block;" text="Revisión de tareas escolares" position="top" color="primary">
                                <vs-button size="small" icon-pack="feather" icon="icon-info" @click="calificar(tr)" class="mr-2" color="primary"></vs-button>
                            </vx-tooltip>
                            <vx-tooltip style="display: inline-block;" text="Editar tarea" position="top" color="warning">
                                <vs-button size="small" icon-pack="feather" icon="icon-edit" @click="editar(tr)" class="mr-2" color="warning"></vs-button>
                            </vx-tooltip>
                            <vx-tooltip style="display: inline-block;" text="Eliminar tarea" position="top" color="danger">
                                <vs-button size="small" icon-pack="feather" icon="icon-trash" @click="confirmaEliminar(tr.tarea.idtarea)" class="mr-2" color="danger"></vs-button>
                            </vx-tooltip>
                        </div>
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>
    </div>
</div>
</template>

<script>
import historicomix from '../../../mixins/historicomix'
import {
    mapState
} from 'vuex'
export default {
    mixins: [historicomix],
    computed: {
        ...mapState(['tareas'])
    },
    data() {
        return {
            eliminarId: '',
            usuario:[]
        }
    },
    mounted() {
        this.usuario = JSON.parse(localStorage.getItem('usuario'))
        this.$store.dispatch('getTareasDocentes')
    },
    methods: {
        confirmaEliminar(id) {
            console.log(id)
            let me = this;
            me.eliminarId = id;
            me.$vs.dialog({
                type: 'confirm',
                color: 'danger',
                title: `Confirmar`,
                text: '¿Está seguro en eliminar esta tarea?',
                acceptText: 'Aceptar',
                cancelText: 'Cancelar',
                accept: me.eliminar
            })
        },
        async eliminar() {
            let me = this;

            me.$vs.loading({
                color: '#046AE7'
            })
            
            try {
                await this.$http.get(this.$server_url + "eliminarTarea?id=" + me.eliminarId)
                await me.$store.dispatch('getTareasDocentes')
                
                me.$vs.loading.close()
                me.$vs.notify({
                    title: 'Éxito',
                    text: 'La tarea se eliminó correctamente',
                    color: 'success',
                    position: 'top-right'
                })
            } catch (error) {
                me.$vs.loading.close()
                me.$vs.notify({
                    title: 'Error',
                    text: 'Error al eliminar la tarea',
                    color: 'danger',
                    position: 'top-right'
                })
                if (error.response && error.response.status == 422) {
                    me.errors = error.response.data.errors;
                }
            }
        },
        editar(item) {
            this.f_saveHistorico(item,'Editar Tarea');
            this.$emit('estado', {
                plista: false,
                pnuevo: false,
                peditar: true,
                pcalificar: false
            });
            this.$emit('tarea', item);
        },
        f_saveHistorico(item,accion){
          let me = this;
          // save historico
          let h_idinstitucion     = me.usuario.institucion_idInstitucion;
          let h_idusuario         = me.usuario.idusuario;
          let h_idgrupo           = me.usuario.id_group;
          let h_idasignatura      = localStorage.idasignatura
          let h_nombreasignatura  = localStorage.nombreasignatura
          let h_recursotipo       = 11; //11 = tarea
          let h_id_curso          = localStorage.idcurso

          let datoHistorico = {
            recurso_accion:accion,
            recurso_detalle: item.tarea.descripcion,
            referencia_id: item.tarea.idtarea,
            tabla_referencia: "tarea",
            curso:localStorage.codigo
          }
          me.saveHistoricoVisitas(h_idinstitucion, h_idusuario, h_idgrupo, h_idasignatura,h_nombreasignatura,  h_recursotipo,datoHistorico,h_id_curso)
        },
        calificar(item) {
          this.f_saveHistorico(item,'Calificar Tarea');
          this.$emit('estado', {
              plista: false,
              pnuevo: false,
              peditar: false,
              pcalificar: true
          });
          this.$emit('tarea', item);
        }
    },
}
</script>
