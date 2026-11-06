<template>
    <div>
        <h3>Novedades </h3>
        <small class="mb-3"><i>Ingresa NOVEDADES referentes a deudas, entregas, o alguna tema a tomar en cuenta en los siguientes pedidos de la institución.</i></small>
        <vs-textarea v-model="nuevaObservacion" placeholder="novedad..."></vs-textarea>
        <vs-button @click="agregarObservacion">Guardar</vs-button>
        <transition>
            <ul class="m-3">
                <li v-for="(observacion, index) in observaciones" :key="index"
                :class="{ 'even': index % 2 === 0, 'odd': index % 2 !== 0 }">
                <small><i><b>{{ observacion.usuario }}</b> - fecha: {{ observacion.created_at }} - <b>{{ observacion.descripcion }}</b></i> </small>
                <p>
                    <small>({{ observacion.id }})</small>   {{ observacion.novedades }}
                </p>
            </li>
        </ul>
    </transition>
    </div>
</template>

<script>
export default {
    props: {
        datosInstitucion: Object,
    },
    data() {
        return {
            observaciones: [],
            nuevaObservacion: "",
            usuario: JSON.parse(localStorage.getItem("usuario") || "Anonimo")
        };
    },
    created() {
        this.cargarObservaciones();
    },
    mounted() {
    },
    methods: {
        cargarObservaciones() {
            this.$vs.loading();
            this.$http.get(this.$server_url + 'get_novedades_institucion/'+ this.datosInstitucion.idInstitucion)
                .then(res => {
                    console.log(res.data)
                    this.observaciones = res.data;
                })
                .catch(error => {
                    console.error('Error:', error);
                })
                .finally(() => {
                    this.$vs.loading.close();
                })

        },
        agregarObservacion() {
            if (this.nuevaObservacion.trim() === "") return;           
            let data1 = new FormData();
            data1.append('idInstitucion', this.datosInstitucion.idInstitucion)
            data1.append('id_periodo', this.datosInstitucion.id_periodo)
            data1.append('id_editor', this.usuario.idusuario)
            data1.append('novedades', this.nuevaObservacion)
            this.$vs.loading();
            this.$http.post(this.$server_url + 'new_novedades', data1)
                .then(res => {
                    console.log(res.data)
                    this.cargarObservaciones();
                })
                .catch(error => {
                    console.error('Error:', error);
                })
                .finally(() => {
                    this.$vs.loading.close();
                })
            this.nuevaObservacion = "";
        }
    }
};
</script>

<style scoped>
textarea {
    display: block;
    width: 100%;
    margin-top: 10px;
}

button {
    margin-top: 5px;
}

ul {
    list-style: none;
    padding: 0;
}

li {
    padding: 10px;
    border-radius: 5px;
    margin-bottom: 5px;
}

.even {
    background-color: #f0f0f0;
}

.odd {
    background-color: #d0d0d0;
}
</style>