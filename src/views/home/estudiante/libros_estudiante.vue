<template>
    <div>
        <vs-table max-items="10" search pagination :data="codigosLibros">
            <template slot="header">
                <vs-chip color="primary">
                    Cantidad de libros: {{ codigosLibros.length }}
                </vs-chip>
            </template>
            <template slot="thead">
                <vs-th>
                    Codigo
                </vs-th>
                <vs-th>
                    Periodo
                </vs-th>
                <vs-th>
                    Ultima actualizacion
                </vs-th>
                <vs-th>
                    Datos Verificación
                </vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td :data="data[indextr].codigo">
                        <b>Libro:</b>
                        <p>{{ tr.nombrelibro }}</p>
                        <b>Código:</b>
                       <p>{{ data[indextr].codigo }}</p> 
                        <p style="font-weight:bold;">Estado_liquidacion:</p>
                        <span>{{ tr.liquidacion }}</span>
                        <p style="font-weight:bold;">Estado:</p>
                        <span>
                            {{ tr.codigoEstado }}<br>
                        </span>
                    </vs-td>
                    <vs-td :data="data[indextr].descripcion">
                        {{ data[indextr].descripcion }}
                    </vs-td>
                    <vs-td :data="data[indextr].updated_at">
                        {{ data[indextr].updated_at }}
                    </vs-td>
                    <vs-td>
                        <span style=" font-weight:600; ">
                            <vs-chip color="primary" v-if="tr.verif1 > 0">Verificación Nº 1</vs-chip>
                            <vs-chip color="primary" v-if="tr.verif2 > 0">Verificación Nº 2</vs-chip>
                            <vs-chip color="primary" v-if="tr.verif3 > 0">Verificación Nº 3</vs-chip>
                            <vs-chip color="primary" v-if="tr.verif4 > 0">Verificación Nº 4</vs-chip>
                            <vs-chip color="primary" v-if="tr.verif5 > 0">Verificación Nº 5</vs-chip>
                        </span>
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>
    </div>
</template>
<script>
export default {
    data() {
        return {
            codigosLibros: []
        }
    },
    props: {
        datoEstudiante: {
            type: Object
        },
    },
    mounted() {
        let me = this;
        // console.log(me.datoEstudiante)
        me.verLibrosEstudiante(me.datoEstudiante.idusuario, me.datoEstudiante.institucion_idInstitucion);
    },
    methods: {
        verLibrosEstudiante(idusuario, institucion_idInstitucion) {
            let me = this;
            me.$vs.loading();
            let libro = "yes"
            this.$http.get(this.$server_url + 'busquedaFiltroEstudiante?libroEstudiante=' + libro + '&idusuario=' + idusuario + '&institucion=' + institucion_idInstitucion)
                .then(function (res) {
                    me.codigosLibros = res.data.codigos;
                    if (res.data.message) {
                        me.f_notificaciones(res.data.message, 'success', 'icon-check');
                    }
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    console.log(error + ' error');
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
        },
    }
}
</script>