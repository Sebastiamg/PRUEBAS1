<template>
<div>
    <vs-table max-items="5" search pagination :data="infoarchivos">
        <template slot="header">
            <h3>
                Archivos
            </h3>
        </template>

        <template slot="thead">
            <vs-th>
                Libro
            </vs-th>

            <vs-th>
                nombre_archivo
            </vs-th>
            <vs-th>
                archivo
            </vs-th>

            <vs-th>
                Link
            </vs-th>

            <vs-th>
                Accion
            </vs-th>
        </template>

        <template slot-scope="{data}">
            <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                <vs-td :data="data[indextr].nombrelibro">
                    {{data[indextr].nombrelibro}}
                </vs-td>

                <vs-td :data="data[indextr].nombre_archivo">
                    {{data[indextr].nombre_archivo}}
                </vs-td>
                <vs-td :data="data[indextr].archivo">
                    {{data[indextr].archivo}}
                </vs-td>
               <!-- <vs-td>
                    <a :href="$server_url+'material_cargar/'+ data[indextr].url" target="_blank" rel="noopener noreferrer">Descargar</a>

                </vs-td> -->
                      <vs-td>
                    <a :href="$data_url+'archivos/'+'material_cargar/'+ data[indextr].url" target="_blank" rel="noopener noreferrer">Descargar</a>

                </vs-td>
                <vs-td>

                    <vs-button color="primary" type="border" icon="delete" @click="eliminarArchivo(data[indextr].id_archivo);">

                    </vs-button>
                </vs-td>

            </vs-tr>
        </template>
    </vs-table>
</div>
</template>

<script>
import axios from 'axios'
export default {
    data() {
        return {
            infoarchivos: [],
            infoarchivosid: 0,
        }
    },
    methods: {

        list() {
            let me = this;
            me.$vs.loading()
            this.$http.get(this.$server_url + `cargarmaterial/` + this.infoarchivosid).then(res => {
                    this.infoarchivos = res.data;

                    me.$vs.loading.close();

                })
                .catch(function (error) {
                    console.log(error)
                })

        },
        //para eliminar el archivo
        eliminarArchivo(id_archivo) {
            let me = this;
            let formData = new FormData();
            formData.append('id_archivo', id_archivo);

            me.$vs.loading()
            axios.post(this.$data_url+'api/archivoseliminar', formData)
            // this.$http.post(this.$server_url + 'archivoseliminar', formData)
                .then(res => {
                    // me.$router.go(0)
                 
                    me.$vs.loading.close()
                
                    me.$vs.notify({
                        text: res.data.message,
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                    me.list();
                })
        }
    },
    created() {

        let transformaraParse = JSON.parse(localStorage.getItem('infoarchivosid'));
        //llenar el arreglo  de archivos 
        this.infoarchivosid = transformaraParse;
        this.list();

    }
}
</script>
