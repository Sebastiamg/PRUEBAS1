<template>
<div>
    <div v-if="!esCapacitador" class="p-6">
        <vs-alert color="danger" icon="error">
            <span>No tienes permisos para acceder a esta vista. Solo los capacitadores pueden ver esta información.</span>
        </vs-alert>
    </div>
    
    <vx-card v-else>
        <vs-alert class="mb-4" color="primary" icon="info">
            <span class="text-sm">
                Listado de capacitaciones asignadas al capacitador. Aquí puedes revisar el estado, fechas y observaciones de cada capacitación.
            </span>
        </vs-alert>

        <div class="vx-row mb-4">
            <div class="vx-col w-full sm:w-full md:w-full lg:w-3/5 xl:w-1/2">
                <span class="font-semibold">Estado</span>
                <ul class="flex mt-2 items-center">
                    <li>
                        <vs-radio v-model="estadoSelect" @input="obtenerCapacitaciones();" class="mr-2" vs-name="radiosEstado" vs-value="1">Pendientes</vs-radio>
                    </li>
                    <li>
                        <vs-radio v-model="estadoSelect" @input="obtenerCapacitaciones();" class="mr-2" vs-name="radiosEstado" vs-value="2">Realizadas</vs-radio>
                    </li>
                    <li>
                        <vs-radio v-model="estadoSelect" @input="obtenerCapacitaciones();" class="mr-2" vs-name="radiosEstado" vs-value="0">Canceladas</vs-radio>
                    </li>
                    <li class="ml-2">
                        <vs-button @click="obtenerCapacitaciones();" color="primary" type="filled" icon="refresh" size="small">
                            Actualizar
                        </vs-button>
                    </li>
                </ul>
            </div>
        </div>

        <vs-divider></vs-divider>

        <div v-if="capacitaciones.length > 0">
            <vs-table max-items="10" search pagination :data="capacitaciones">
                <template slot="header">
                    <vs-chip color="primary">Cantidad: <b>{{ capacitaciones.length }}</b></vs-chip>
                </template>
                <template slot="thead">
                    <vs-th sort-key="nombre">Título</vs-th>
                    <vs-th sort-key="nombreInstitucion">Escuela</vs-th>
                    <vs-th sort-key="fecha_inicio">Fecha</vs-th>
                    <vs-th>Hora</vs-th>
                    <vs-th>Observaciones</vs-th>
                    <vs-th>Estado</vs-th>
                </template>
                <template slot-scope="{data}">
                    <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                        <vs-td>
                            #{{tr.id_seminario}} <br>
                            <span class="font-semibold">{{ tr.nombre }}</span>
                        </vs-td>
                        <vs-td>
                            {{ tr.nombreInstitucion }}
                        </vs-td>
                        <vs-td>
                            {{ formatearFecha(tr.fecha_inicio) }}
                        </vs-td>
                        <vs-td>
                            <span class="text-sm">
                                <b>Inicio:</b> {{ tr.hora_inicio }}<br>
                                <b>Fin:</b> {{ tr.hora_fin }}
                            </span>
                        </vs-td>
                        <vs-td>
                            <span v-if="tr.observacion_admin">{{ tr.observacion_admin }}</span>
                            <span v-else class="text-gray-400">Sin observaciones</span>
                        </vs-td>
                        <vs-td>
                            <vs-chip v-if="tr.estado_capacitacion == 0" color="danger">Cancelada</vs-chip>
                            <vs-chip v-else-if="tr.estado_capacitacion == 1" color="warning">Pendiente</vs-chip>
                            <vs-chip v-else-if="tr.estado_capacitacion == 2" color="success">Realizada</vs-chip>
                        </vs-td>
                    </vs-tr>
                </template>
            </vs-table>
        </div>
        <div v-else class="p-6">
            <vs-alert color="warning" icon="info">
                <span>No tienes capacitaciones asignadas.</span>
            </vs-alert>
        </div>
    </vx-card>
</div>
</template>

<script>
import moment from 'moment';

export default {
    data() {
        return {
            capacitaciones: [],
            usuario: null,
            esCapacitador: false,
            estadoSelect: 1, // 1 = Pendiente por defecto
        }
    },
    methods: {
        obtenerCapacitaciones() {
            let me = this;
            
            if (!me.esCapacitador) {
                return;
            }
            
            me.$vs.loading();
            
            // Llamar al endpoint con el idusuario y estadoCapacitacion
            me.$http.get(`${me.$server_url}reporte/capacitaciones?estadoCapacitacion=${me.estadoSelect}&idusuario=${me.usuario.idusuario}`)
                .then((res) => {
                    me.capacitaciones = res.data;
                    
                    if (me.capacitaciones.length == 0) {
                        me.$vs.notify({
                            title: 'Información',
                            text: 'No se encontraron capacitaciones asignadas',
                            color: 'warning',
                            iconPack: 'feather',
                            icon: 'icon-info'
                        });
                    }
                })
                .catch((err) => {
                    me.$vs.notify({
                        title: 'Error',
                        text: 'Error al obtener las capacitaciones',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-circle'
                    });
                    console.error(err);
                })
                .finally(() => {
                    me.$vs.loading.close();
                });
        },
        formatearFecha(fecha) {
            return moment(fecha).format('DD/MM/YYYY');
        },
        validarPermisos() {
            let me = this;
            me.usuario = JSON.parse(localStorage.getItem('usuario'));
            
            if (!me.usuario) {
                me.$router.push('/');
                return;
            }
            
            // Validar si es capacitador
            me.esCapacitador = me.usuario.capacitador == 1 || me.usuario.capacitador === '1';
            
            if (me.esCapacitador) {
                me.obtenerCapacitaciones();
            }
        }
    },
    created() {
        this.validarPermisos();
    },
    mounted() {
        moment.locale('es');
    }
}
</script>

<style scoped>
.font-semibold {
    font-weight: 600;
}

.text-gray-400 {
    color: #9ca3af;
}
</style>
