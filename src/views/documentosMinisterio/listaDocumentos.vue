<template>
<div class="vx-col md:w-full w-full mb-base">
    <vx-card>
        <vs-button v-if="grupo_usuario==1" class="m-1" @click="nuevoDoc()" color="success">Agregar</vs-button>
        <vs-table max-items="10" search pagination :data="documentos" style="margin-top:-20px" class="stripe">
            <template slot="header">
                <p>Total de documentos ministeriales registrados: <b>{{documentos.length}}</b> </p>
            </template>
            <template slot="thead">
                <vs-th>Nombre</vs-th>
                <vs-th>Asignatura</vs-th>
                <vs-th>Estado</vs-th>
                <vs-th>Acciones</vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td width="50%">
                        {{data[indextr].nombre}} <br>
                        <small>{{data[indextr].descripcion}}</small>
                    </vs-td>
                    <vs-td height="30%" width="50%">
                        <div class="overflow-y-auto h-24">
                            <vs-chip color="primary" :key="index" v-for="(item,index) in tr.asignaturas">
                                {{item.label}}
                            </vs-chip>
                        </div>
                    </vs-td>
                    <vs-td>
                        <small v-if="data[indextr].status" class="text-success"> Publicado</small>
                        <small v-else class="text-danger">Inactivo</small><br>
                        <small> Actualizada: {{fechaLarga(data[indextr].updated_at)}} </small>
                    </vs-td>
                    <vs-td>
                        <vx-tooltip v-if="grupo_usuario == 1" style="display: inline-block;" text="editar publicación" position="top" color="success">
                            <vs-button @click="editarDoc(data[indextr])" size="small" radius icon-pack="feather" icon="icon-edit" color="success" type="gradient"></vs-button>
                        </vx-tooltip>
                        <vx-tooltip style="display: inline-block;" text="ver publicación" position="top" color="primary">
                            <vs-button @click="verAdaptacion(data[indextr])" size="small" radius icon-pack="feather" icon="icon-eye" color="primary" type="gradient"></vs-button>
                        </vx-tooltip>
                        <vx-tooltip v-if="grupo_usuario == 1" style="display: inline-block;" text="eliminar publicaciòn" position="top" color="danger">
                            <vs-button @click="openConfirm(data[indextr].id)" size="small" radius icon-pack="feather" icon="icon-trash" color="danger" type="gradient"></vs-button>
                        </vx-tooltip>
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>
    </vx-card>
</div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import vSelect from 'vue-select'
export default {
    components: {
        'v-select': vSelect,
    },
    data() {
        return {
            documentos: [],
            pesoArchivo: '',
            porcentaje: '',
            grupo_usuario: '',
        }
    },
    mounted() {
        let me = this;
        me.usuario = JSON.parse(localStorage.getItem('usuario'));
        me.grupo_usuario = me.usuario.id_group;
        me.getDocumentos();
    },
    methods: {
        getDocumentos() {
            let me = this;
            this.$http.get(this.$server_url + 'getDocumentos')
                .then(res => {
                    me.documentos = res.data.items
                })
                .catch(error => {
                    console.log('no se conecto a los documentos ministeriales ' + error)
                })
        },
        nuevoDoc() {
            let me = this;
            me.$router.push('/admin/nuevoDocumento');
        },
        verAdaptacion(item) {
            let me = this;
            localStorage.setItem('doc', JSON.stringify(item));
            me.$router.push('/admin/viewDocument');
        },
        editarDoc(item) {
            let me = this;
            localStorage.setItem('doc', JSON.stringify(item));
            me.$router.push('/admin/editarDocumentos');
        },
        openConfirm(id, nombre) {
            let me = this;
            me.id = id

            this.$vs.dialog({
                type: 'confirm',
                color: 'danger',
                title: `Confirmación`,
                text: 'Está seguro en eliminar este archivo',
                accept: this.getEliminar
            })
        },
        getEliminar(id) {
            let me = this;
            console.log(id)
            this.$http.post(this.$server_url + "documentDelete?id=" + me.id)

                .then(function (response) {
                    me.$vs.notify({
                        color: 'warning',
                        text: 'Registro eliminado'
                    })
                    me.getDocumentos()
                })
                .catch(function (error) {})
        }
    }
}
</script>
