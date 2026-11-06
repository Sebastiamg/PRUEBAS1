<template>
<vx-card class='vx-col w-full mt-4'>
    <div class="vx-col w-full">
        <div>Código a buscar en el histórico</div>
        <vs-input type="text" class="inputx w-full mb-6" max-length="25" @keyup.enter="btn_buscar()" v-model="codigo" placeholder="Código a buscar en el historico" />
    </div>
    <div class="vx-col w-full flex">
        <vs-button class="m-2 mb-2" color="danger" icon="close" type="gradient" @click="btn_limpiar()"> </vs-button>
        <vs-button class="m-2 mb-2" color="primary" type="gradient" @click="btn_buscar()">Buscar </vs-button>
    </div>
    <section>
        <vs-table max-items="10" search pagination :data="listaCodigos">
            <template slot="header">
                <div class="vx-col w-1/1"> Cantidad de historicos: &nbsp; <b>{{listaCodigos.length}}</b> </div>
            </template>
            <template slot="thead">
                <vs-th>Codigo</vs-th>
                <vs-th>Editor</vs-th>
                <vs-th>Contrato</vs-th>
                <vs-th>Observacion</vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td width="20%">
                        # {{ tr.id_codlibros}}<br>
                        {{ tr.codigo_libro}} <br>
                        <b>creado: </b> <br>{{ tr.created_at }}
                    </vs-td>
                    <vs-td width="30%">
                        <b>user:</b><br> {{ tr.nombres}} {{ tr.apellidos}}<br>
                        <b>institucion:</b> <br>{{ tr.nombreInstitucion}}<br>
                    </vs-td>
                    <vs-td width="20%">
                        <b>anterior:</b><br> {{ tr.contrato_anterior}}<br>
                        <b>actual:</b> <br>{{ tr.contrato_actual}}<br>
                        <b>verificacion_liquidada:</b><br> {{ tr.verificacion_liquidada}}<br>
                    </vs-td>
                    <vs-td width="30%">
                        <b>observacion:</b><br> {{ tr.observacion}}<br>
                        <b>Old values:</b><br> {{ tr.old_values}}<br>
                        <b>New values:</b><br> {{ tr.new_values}}<br>
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>
    </section>
</vx-card>
</template>

<script>
export default {
    components: {},
    data() {
        return {
            codigo: '',
            listaCodigos: [],
        };
    },
    created() {},
    mounted() {},
    methods: {
        btn_buscar() {
            let me = this;
            if (me.codigo.length < 4) {
                me.f_notificaciones('Ingrese mínimo 4 digitos', 'error')
                return
            }
            me.$vs.loading();
            this.$http.get(this.$server_url + 'search_from_historic/' + me.codigo)
                .then(res => {
                    console.log(res.data)
                    me.listaCodigos = res.data;
                    me.f_notificaciones('se ha encontrado ' + res.data.length + ' códigos', 'error')
                    me.$vs.loading.close();
                })
                .catch(err => {
                    console.log(err)
                    me.f_notificaciones('No existe información relacionada al código solicitado.', 'error')
                    me.$vs.loading.close();

                })
        },
        btn_limpiar() {
            let me = this;
            me.codigo = '';
        },
        f_notificaciones(mensaje, color) {
            let me = this;
            let color1, icono1;

            if (color == 'ok') {
                color1 = 'success';
                icono1 = 'icon-check';
            } else {
                color1 = 'danger';
                icono1 = 'icon-danger';
            }

            me.$vs.notify({
                text: mensaje,
                color: color1,
                iconPack: 'feather',
                icon: icono1
            })
        }
    }
};
</script>
