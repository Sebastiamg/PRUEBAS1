<template>
<div class="library-page">
    <div class="container">
        <div class="content">
            <div v-if="datoLocalStorage && libros.length > 0">
                <!-- Navbar con nombre de la institución -->
                <div class="navbar">
                    <div class="navbar-top">
                        <img src="https://plataforma.prolipadigital.com.ec/logo.png" alt="Logo" class="logo" />
                        <h1 class="navbar-title">Librería Digital</h1>
                    </div>
                    <!-- <div class="institucion-name">
                <h1>Institucion:{{ institucionLibro.nombreInstitucion }}</h1>
              </div> -->
                    <!-- Caja de búsqueda alineada abajo -->
                    <div class="search-container">
                        <input type="text" v-model="searchQuery" placeholder="Buscar libro por nombre..." @input="filterBooks" @keypress.enter="filterBooks" class="search-input" />
                    </div>
                </div>

                <!-- Sección principal con los libros -->
                <div class="book-list">
                    <div v-for="(item, $index) in filteredLibros" :key="$index" class="book-card-container">
                        <vx-card class="book-card">
                            <div slot="no-body" class="book-card-body">
                                <img v-if="item.weblibro" :src="$data_url + 'archivos/upload/libro/' + item.weblibro + '/portada.png'" alt="Portada del libro" class="book-image" />
                                <img v-else :src="$data_url + 'tareas/img/' + item.portada" alt="Portada del libro" class="book-image" />
                                <p class="book-title">{{ item.nombrelibro }}</p>
                                <small class="book-description">{{ item.descripcionlibro }}</small>
                                <vs-button color="dark" type="relief" class="w-full mt-3" icon-pack="feather" @click="datolibro(item, item.weblibro)" icon="icon-book">
                                    Libro Web
                                </vs-button>
                            </div>
                        </vx-card>
                    </div>
                </div>
            </div>

            <div v-else class="container">
                <!-- Alerta si no se pudo cargar el dato -->
                <vs-alert v-if="!datoLocalStorage" color="danger" icon="icon-alert-circle" class="w-full mt-5" title="Error" :active="!datoLocalStorage">
                    No se pudo verificar los datos de la institución.
                </vs-alert>
            </div>
        </div>
    </div>
</div>
</template>

<script>
export default {
    data() {
        return {
            InstitucionID: null,
            periodoID: null,
            libros: [],
            datoLocalStorage: null,
            unidadesLibro: [],
            institucionLibro: [],
            series: [],
            searchQuery: "",
            filteredLibros: [],
        };
    },

    mounted() {
        this.datoLocalStorage = localStorage.getItem('datosInstitucion');

        if (!this.datoLocalStorage) {
            this.libros = [];
            return;
        }

        const queryParams = this.$route.query;
        if (queryParams.datosInstitucion) {
            try {
                const datosInstitucion = JSON.parse(decodeURIComponent(queryParams.datosInstitucion));
                this.InstitucionID = datosInstitucion.li_idInstitucion;
                this.periodoID = datosInstitucion.li_periodo;
                this.getinfoInstitucion();
                this.getLibros();
            } catch (error) {
                console.error('Error al parsear los datos:', error);
                this.libros = [];
            }
        }
    },

    methods: {
        getinfoInstitucion() {
            let me = this;
            me.$vs.loading();
            this.$http
                .get(this.$server_url + 'InstitucionLibrosInformacion/' + me.InstitucionID)
                .then(function (res) {
                    me.institucionLibro = res.data[0];
                    me.$vs.loading.close();
                })
                .catch(function (error) {
                    console.error('Error al obtener los datos:', error);
                    me.$vs.loading.close();
                });
        },

        getLibros() {
            let me = this;
            me.$vs.loading();
            this.$http
                .get(this.$server_url + 'LibrosInstitucionBusqueda/' + me.InstitucionID + '/' + me.periodoID)
                .then(function (res) {
                    me.libros = res.data;
                    me.filteredLibros = res.data;
                    me.$vs.loading.close();
                })
                .catch(function (error) {
                    me.$vs.loading.close();
                    console.error(error);
                });
        },

        filterBooks() {
            if (!this.searchQuery) {
                this.filteredLibros = this.libros;
            } else {
                this.filteredLibros = this.libros.filter(book =>
                    book.nombrelibro.toLowerCase().includes(this.searchQuery.toLowerCase())
                );
            }
        },

        datolibro(item, url) {
            let me = this;
            let region = this.institucionLibro.region_idregion;

            me.$vs.loading();

            this.$http.get(this.$server_url + 'menu_unidades_libros/' + item.idlibro + '/' + region)
                .then(function (response) {
                    me.unidadesLibro = response.data;

                    me.$vs.loading.close();

                    if (me.unidadesLibro.length > 0) {
                        const firstUnit = me.unidadesLibro[0];
                        const lastUnit = me.unidadesLibro[me.unidadesLibro.length - 1];

                        localStorage.pag_inicio = firstUnit.pag_inicio;
                        localStorage.pag_fin = lastUnit.pag_fin;
                    }

                    localStorage.vistalibro = 'por_unidad';

                    localStorage.url = url;

                    let route = me.$router.resolve({
                        path: '/libros_institucion/desgloselibro'
                    });

                    window.open(route.href, '_blank');
                })
                .catch(function (error) {
                    me.$vs.loading.close();
                    console.error('Error al cargar el libro:', error);
                });
        },
    },
};
</script>

<style scoped>
.library-page {
    font-family: 'Arial', sans-serif;
    padding: 0;
    background-image: url('https://wallpapers.com/images/hd/bibliotecallena-de-libros-vyy56lqa9wji657j.jpg');
    background-size: cover;
    background-position: center;
    background-attachment: fixed;
    /* Deja esta propiedad solo si deseas que el fondo se quede fijo al hacer scroll */
    background-repeat: no-repeat;
    /* Asegura que el fondo no se repita */
    margin: 0;
    height: 100%;
    /* Asegura que la altura del contenedor sea el 100% de la ventana */
    min-height: 100vh;
    /* Esto asegura que siempre ocupe al menos el 100% de la altura de la ventana */
}

.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 20px;
    padding-bottom: 20px;
    width: 100%;
    height: 100%;
    /* Asegura que el contenedor ocupe el 100% de la altura de su contenedor padre */
    min-height: 100vh;
    box-sizing: border-box;
}

.content {
    background-color: #eeecec;
    padding: 10px;
    width: 100%;
    height: auto;
    /* Deja que el contenido crezca según sea necesario */
    min-height: 100vh;
    /* Asegura que el contenido siempre ocupe al menos el 100% de la pantalla */
    border-radius: 10px;
    display: flex;
    flex-direction: column;
}

.navbar {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #fff;
    padding: 15px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
    border-radius: 10px;
}

.navbar-top {
    display: flex;
    justify-content: left;
    align-items: center;
    width: 100%;
}

.navbar h1 {
    color: #333;
    font-size: 24px;
    font-weight: 600;
    text-align: center;
}

.search-container {
    width: 50%;
    margin-top: 10px;
    text-align: center;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    text-align: right;
}

.search-input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 16px;
    transition: border 0.3s;
}

.search-input:focus {
    border-color: #0e0e0e;
}

.book-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
    width: 100%;
}

.book-card-container {
    display: flex;
    justify-content: center;
}

.book-card {
    width: 100%;
    max-width: 250px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    overflow: hidden;
    transition: transform 0.3s ease;
}

.book-card:hover {
    transform: translateY(-5px);
}

.book-card-body {
    padding: 20px;
    text-align: center;
}

.book-image {
    width: 100%;
    height: auto;
    object-fit: cover;
    max-height: 200px;
    margin-bottom: 10px;
}

.book-title {
    font-size: 18px;
    font-weight: 600;
    color: #333;
    margin-top: 10px;
}

.book-description {
    font-size: 14px;
    color: #777;
}

@media (max-width: 768px) {
    .navbar-top {
        flex-direction: column;
        align-items: center;
    }

    .navbar h1 {
        font-size: 20px;
        text-align: center;
    }

    .book-list {
        grid-template-columns: 1fr 1fr;
    }

    .search-input {
        font-size: 14px;
    }

    .search-container {
        width: 100%;
    }
}

@media (max-width: 480px) {
    .navbar-top {
        flex-direction: column;
    }

    .navbar h1 {
        font-size: 18px;
    }

    .book-list {
        grid-template-columns: 1fr;
    }

    .search-input {
        font-size: 12px;
    }

    .search-container {
        width: 100%;
    }
}
</style>
