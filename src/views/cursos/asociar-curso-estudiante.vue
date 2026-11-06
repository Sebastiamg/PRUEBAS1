<template>
<div class='vx-col w-full mt-4'>
    <section>
      <!-- {{ codigoSelect }} codigoCurso -->
        <div class="centerx icons-example flex">
            <vs-input class="w-full" placeholder="Ingrese la cédula del estudiante" v-model="cedula" @keyup.enter="f_buscar_cedula()" />
            <vs-button @click="f_buscar_cedula()">Añadir</vs-button>
        </div>
    </section>
    <section>
        <vs-table max-items="40" search pagination :data="dato_usuario">
            <template slot="header">
                <span>Cantidad: {{ dato_usuario.length }} </span>
            </template>
            <template slot="thead">
                <vs-th sort-key="nombres">Nombre</vs-th>
                <vs-th sort-key="email">Email</vs-th>
                <vs-th sort-key="deskripsi">Grupo</vs-th>
                <vs-th></vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td>
                        {{data[indextr].nombres}}
                        {{data[indextr].apellidos}}<br />
                    </vs-td>
                    <vs-td>
                        {{data[indextr].email}}<br />
                        <b>usuario:</b> {{data[indextr].name_usuario}}<br>
                        <b>clave:</b> {{data[indextr].cedula}}
                    </vs-td>
                    <vs-td>
                        {{data[indextr].deskripsi}}
                    </vs-td>
                    <vs-td>
                        <vs-button class="m-2" radius color="dark" type="gradient" icon="add" @click="btn_asociarEstudiante(data[indextr])"></vs-button>
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>
    </section>
</div>
</template>

<script>
export default {
    props: {
        codigoSelect: {
            type: String,
            default: ''
        }
    },
    components: {},
    data() {
        return {
            cedula: '',
            dato_usuario: {},
            codigo: '',
        };
    },
    created() {},
    mounted() {},
    methods: {
        f_buscar_cedula() {
            let me = this;
            console.log(me.cedula);
            let formData = new FormData();
            formData.append('cedula', me.cedula);
            me.$vs.loading()
            this.$http.get(this.$server_url + 'buscarXCedula/' + me.cedula)
                .then(res => {
                    console.log(res.data)
                    me.dato_usuario = res.data;
                    me.$vs.loading.close()
                })
                .catch(err => {
                    console.log(err)
                    me.$vs.loading.close()
                })
        },
        btn_asociarEstudiante(e) {
            let me = this;
            let formData = new FormData();
            formData.append('codigo', me.codigoSelect);
            formData.append('idusuario', e.idusuario);
            // console.log(me.codigoSelect,e.idusuario )

            me.$vs.loading()
            this.$http.post(this.$server_url + 'addClase', formData)
                .then(function (res) {
                  console.log(res.data.message)
                  if (res.data.status == 0) {
                    me.f_notificaciones(res.data.message, 'danger', 'alert-triangle');
                  }else{
                    me.f_notificaciones(res.data.message, 'success', 'check');
                  }
                  me.$vs.loading.close()
                })
                .catch(function (error) {
                  console.log(error)
                  me.f_notificaciones(res.data.message, 'danger', 'alert-triangle');
                    me.$vs.loading.close()
                })
        },
        f_notificaciones(msj, color, icono) {
                let me = this;
                me.$vs.notify({
                    text: msj,
                    color: color,
                    iconPack: 'feather',
                    icon: icono
                })
                return;
            }
    }
};
</script>
