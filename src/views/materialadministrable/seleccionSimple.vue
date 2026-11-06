<template>
<div class="vx-col md:w-full w-full mb-base">
    <vx-card class="mb-2">
        <h3 class="text-primary">{{titulo_material}}</h3>
        <p>{{descripcion_material}}</p>
        <h4 class="mt-3">
            <vs-button style="display:inline-block" color="success" icon-pack="feather" icon="icon-bookmark"></vs-button> <b> {{titulo_categoria}} </b>
        </h4>
    </vx-card>
    <vx-card class="mb-2">
        <div class="vx-row">
            <div class="vx-col w-full">
                <center>
                    <h3 class="text-warning"> <b> {{nombre_imagen}} </b> </h3>
                    <p class="m-2" v-if="src_imagen.length > 0"> <img :src="src_imagen" alt="" class="alto-maximo img-responsive"> </p>
                </center>
            </div>
        </div>
    </vx-card>
    <vx-card class="mb-2">
        <div class="vx-col w-full mx-auto mb-base">
            <center>
                <p> <b> {{titulo_pregunta}} </b> </p>
                

                <vx-card class="opt-seleccion p-2 m-2" v-for="(item, index) in opt_opciones" :key="index" :id="item.id" :data-id="item.id" :data-resp="item.resp" @click="getOpcion(item)">
                    <div class="card-body">
                        <p v-if="item.img.length >0"> <img :src="item.img" alt="" class="img-opcion img-responsive"> </p>
                        <p> {{item.texto}} </p>
                    </div>
                </vx-card>

            </center>
        </div>
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
            titulo_material: 'Notas del historiador',
            descripcion_material: 'Historia e historiografía',
            titulo_categoria: 'Construcción',
            nombre_imagen: 'Ruinas de Mohenjo-Daro',
            src_imagen: 'https://www.conclusion.com.ar/wp-content/uploads/2017/01/mohenjo-daro.jpg',
            titulo_pregunta: 'Civilización',
            opt_opciones: [{
                    'id': 1,
                    'texto': 'Su principal fuente de alimentación fue el maíz',
                    'img': 'https://assets.puzzlefactory.pl/puzzle/216/286/original.jpg',
                    'resp': 'si'
                },
                {
                    'id': 2,
                    'texto': 'Contaba con avanzados sistemas de desagüe',
                    'img': 'https://www.conmishijos.com/assets/posts/6000/6984-dibujos-nina-y-mariposa.jpg',
                    'resp': 'no'
                },
                {
                    'id': 3,
                    'texto': 'Fue un gran centro ceremonial',
                    'img': 'http://3.bp.blogspot.com/-IC-aIXVKEQ4/UQL-ldrNqZI/AAAAAAAArek/oC5XQBkg8h8/s1600/ninaconflorparacolorear.jpg',
                    'resp': 'no'
                },
                {
                    'id': 4,
                    'texto': 'No existió las clases sociales',
                    'img': '',
                    'resp': 'no'
                },
                {
                    'id': 5,
                    'texto': 'Fabricaban sellos de piedra para marcar sus bienes',
                    'img':'',
                    'resp': 'no'
                },
            ]
        }
    },
    mounted() {},
    methods: {
        getOpcion(item) {
            console.log(item.id)
            window.$(".opt-seleccion").addClass("text-warning").removeClass("seleccionado");
            window.$("#" + item.id).removeClass("text-warning").addClass("seleccionado");
        }
    }
}
</script>

<style lang="css">
.alto-maximo {
    max-height: 200px;
}

.opt-seleccion {
    border: #ff9800 1px solid;
    border-radius: 10px;
    display: inline-table;
    cursor: pointer;
    width: 260px;
    height: 200px;
    font-size: 1.2em;
}

.opt-seleccion:hover {
    filter: brightness(1.2);
}

.seleccionado:hover {
    filter: none;
}

.seleccionado {
    color: white;
    background-color: orange;
}

.card-img-top {
    /* width: 100%; */
    height: 15vw;
    object-fit: cover;
}
.img-opcion{
    width: 90%;
    min-height: 90px;
    max-height: 100px;
    mix-blend-mode: multiply;
}
</style>
