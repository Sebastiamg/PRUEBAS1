<template>
<div>
    <vs-popup :title="'Equipo '+inc_equipos " :active.sync="modal_carta_elegida" backdrop="static">
        <div class="vx-col w-full mt-2 mx-auto" v-if="modal_carta_elegida">
            <!-- {{arr_equipos[inc_equipos-1]}} -->
            <!-- <h3 class="text-underline">Equipo {{res_carta}} </h3> -->
            <img class="card-big mx-auto" :src="require('../../assets/cartas/'+res_carta.src)">
            <div class="text-center">
                <vs-button class="mt-4 d-inline m-2" color="primary" type="filled" @click="f_reto(1)">Reto cumplido</vs-button>
                <vs-button class="mt-4 d-inline m-2" color="danger" type="filled" @click="f_reto(2)">Reto NO cumplido</vs-button>
            </div>
        </div>
    </vs-popup>
    <vs-popup title="Resultados" :active.sync="modal_resultados" fullscreen>
        <vs-row vs-align="flex-end" vs-justify="center" vs-w="12">
            <vs-col v-if="arr_equipos[0] != null || arr_equipos[0] != undefined" vs-justify="center" vs-align="center" vs-lg="4" vs-md="4" vs-sm="12" vs-xs="4">
                <p class="text-center">
                    <img class="mt-5 p-5" width="98%" src="@/assets/cartas/primero.png" />
                </p>
                <h2 class="text-center valor-equipo">{{arr_equipos[0].nombre}} <br />{{arr_equipos[0].puntos}} pts. </h2>
            </vs-col>
            <vs-col v-if="arr_equipos[1] != null || arr_equipos[1] != undefined" vs-justify="center" vs-align="center" vs-lg="4" vs-md="4" vs-sm="12" vs-xs="4" class="mt-5">
                <p class="text-center">
                    <img class="mt-5 p-5" width="85%" src="@/assets/cartas/segundo.png" />
                </p>
                <h2 class="text-center valor-equipo">{{arr_equipos[1].nombre}} <br />{{arr_equipos[1].puntos}} pts. </h2>
            </vs-col>
            <vs-col v-if="arr_equipos[2] != null || arr_equipos[2] != undefined" vs-justify="center" vs-align="center" vs-lg="4" vs-md="4" vs-sm="12" vs-xs="4" class="mt-5">
                <p class="text-center">
                    <img class="mt-5 p-5" width="85%" src="@/assets/cartas/tercero.png" />
                </p>
                <h2 class="text-center valor-equipo">{{arr_equipos[2].nombre}} <br />{{arr_equipos[2].puntos}} pts. </h2>
            </vs-col>
        </vs-row>

    </vs-popup>
    <vx-card>

        <vs-row v-show="!visible_inicio" class="justify-center">
            <vs-col vs-lg="4" vs-md="4" vs-sm="6" vs-xs="12">
                <h4>Cuantos equipos van a participar?</h4>
                <vs-input type="number" label="Cantidad" autofocus min="0" max="4" v-model="txt_equipos" @keypress.enter="f_empezar()" class="w-full" />
                <vs-button class="mt-4" color="primary" type="filled" @click="f_empezar()">Iniciar</vs-button>
            </vs-col>
        </vs-row>
        <vs-row v-show="visible_inicio">
            <vs-col vs-lg="10" vs-md="10" vs-sm="9" vs-xs="9">
                <div class="cards">
                    <div class="m-1" v-for="(item,index) in cartasTmp" :key="index">
                        <span class="numero" :id="'num'+item.id" :ref="'num'+item.id">{{index+1}}</span>
                        <img class="card" :id="'img'+item.id" :src="require('../../assets/cartas/'+item.cover)">
                        <img class="card" :id="'sobre'+item.id" :src="require('../../assets/cartas/'+item.src)">
                    </div>
                </div>
            </vs-col>
            <vs-col vs-lg="2" vs-md="2" vs-sm="3" vs-xs="3" class="color1">
                <div class="mt-3 text-center">
                    <vs-button v-if="btn_visible" class="mx-auto" color="warning" type="relief" icon="star" @click="f_rotar()">Jugar</vs-button>
                    <vs-button v-if="!btn_visible" class="mx-auto" color="primary" type="filled" icon="done" @click="f_resultados()">Resultados</vs-button>
                    <vs-divider></vs-divider>
                    <div class="m-1 mb-4 caja-equipo mx-auto" color="primary" :type="tipo_btn" v-for="(item,index) in arr_equipos" :key="index" :id="'btn'+index"> {{item.nombre}}:
                        <h4>{{item.puntos}} <small>pts.</small></h4>
                    </div>
                </div>
            </vs-col>
        </vs-row>
    </vx-card>
</div>
</template>

<script>
import $ from 'jquery'
export default {
    data() {
        return {
            titulo_modal: '',
            ini: 0,
            arr_equipos: [],
            tipo_btn: 'border',
            modal_resultados: false,
            modal_carta_elegida: false,
            res_carta: '',
            visible_inicio: false,
            btn_visible: true,
            txt_equipos: '',
            inc_equipos: 0,
            inc: 0,
            repeticion: 2,
            repe: 0,
            total_cartas_numbers: [],
            intervalid1: null,
            cartasTmp: [],
            cartas: [{
                    'id': 1,
                    'src': '1.jpg',
                    'cover': 'naranja.jpg'
                },
                {
                    'id': 2,
                    'src': '2.jpg',
                    'cover': 'naranja.jpg'
                },
                {
                    'id': 3,
                    'src': '3.jpg',
                    'cover': 'verde.jpg'
                },
                {
                    'id': 4,
                    'src': '4.jpg',
                    'cover': 'naranja.jpg'
                },
                {
                    'id': 5,
                    'src': '5.jpg',
                    'cover': 'naranja.jpg'
                },
                {
                    'id': 6,
                    'src': '6.jpg',
                    'cover': 'naranja.jpg'
                },
                {
                    'id': 7,
                    'src': '7.jpg',
                    'cover': 'naranja.jpg'
                },
                {
                    'id': 8,
                    'src': '8.jpg',
                    'cover': 'verde.jpg'
                },
                {
                    'id': 9,
                    'src': '9.jpg',
                    'cover': 'naranja.jpg'
                },
            ],
            cartasT: [{
                    'id': 1,
                    'src': '1.jpg',
                    'cover': 'naranja.jpg'
                },
                {
                    'id': 2,
                    'src': '2.jpg',
                    'cover': 'naranja.jpg'
                },
                {
                    'id': 3,
                    'src': '3.jpg',
                    'cover': 'verde.jpg'
                },
                {
                    'id': 4,
                    'src': '4.jpg',
                    'cover': 'naranja.jpg'
                },
                {
                    'id': 5,
                    'src': '5.jpg',
                    'cover': 'naranja.jpg'
                },
                {
                    'id': 6,
                    'src': '6.jpg',
                    'cover': 'naranja.jpg'
                },
                {
                    'id': 7,
                    'src': '7.jpg',
                    'cover': 'naranja.jpg'
                },
                {
                    'id': 8,
                    'src': '8.jpg',
                    'cover': 'verde.jpg'
                },
                {
                    'id': 9,
                    'src': '9.jpg',
                    'cover': 'naranja.jpg'
                },
                {
                    'id': 10,
                    'src': '10.jpg',
                    'cover': 'verde.jpg'
                },
                {
                    'id': 11,
                    'src': '11.jpg',
                    'cover': 'verde.jpg'
                },
                {
                    'id': 12,
                    'src': '12.jpg',
                    'cover': 'naranja.jpg'
                },
                {
                    'id': 13,
                    'src': '13.jpg',
                    'cover': 'naranja.jpg'
                },
                {
                    'id': 14,
                    'src': '14.jpg',
                    'cover': 'naranja.jpg'
                },
                {
                    'id': 15,
                    'src': '15.jpg',
                    'cover': 'verde.jpg'
                },
                {
                    'id': 16,
                    'src': '16.jpg',
                    'cover': 'verde.jpg'
                },
                {
                    'id': 17,
                    'src': '17.jpg',
                    'cover': 'verde.jpg'
                },
                {
                    'id': 18,
                    'src': '18.jpg',
                    'cover': 'naranja.jpg'
                },
                {
                    'id': 19,
                    'src': '19.jpg',
                    'cover': 'naranja.jpg'
                },
                {
                    'id': 20,
                    'src': '20.jpg',
                    'cover': 'verde.jpg'
                },
            ]
        }
    },
    mounted() {
        let me = this;
        me.cartasTmp.push(...me.cartas)
        me.cartasTmp.sort(me.f_randomico)
        // console.log(me.cartas[3].src, '--', me.cartasTmp[3].src)
    },
    methods: {
        f_randomico(a, b) {
            if (Math.random() < 0.5) return -1;
            else return 1;
        },
        f_empezar() {
            let me = this
            if (me.txt_equipos < 1 || me.txt_equipos > 4) {
                me.$vs.notify({
                    text: 'La cantidad de equipos debe ser entre 1 y 4',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return;
            }
            for (let index = 0; index < me.txt_equipos; index++) {
                me.arr_equipos.push({
                    'nombre': 'Equipo ' + (index + 1),
                    'puntos': 3,
                })
            }
            me.f_iniciar();
            me.visible_inicio = true;

        },
        f_iniciar() {
            let me = this;
            me.total_cartas_numbers = [];
            for (let index = 1; index <= me.cartas.length; index++) {
                me.total_cartas_numbers.push(index)
                $("#sobre" + (index)).hide();
            } //llenamos el array de numero, para llamar a las cartas, y ocultar las cartas hover
        },
        f_rotar() {
            let me = this;
            let nn = 0;
            let rdn1 = 0;
            clearInterval(me.intervalid1); //limpiamos los intervalos
            clearInterval(me.intervalid2)
            me.repe = 0;
            let long = me.total_cartas_numbers.length; //total cartas
            let isOdd = long % 2; //si el residuo es 0
            if (isOdd == 0 && long < 8) me.repeticion++; //si es menor a 8 aumentamos las repeticiones
            if (long <= 2) me.repeticion = 2; //si hay solo 3 cartas, dejamos 2 repeticiones
            me.f_quitar_zoom();
            // for (let index = 1; index <= me.cartas.length; index++) {
            //     $("#sobre" + (index)).addClass('zoom0'); //quitar zoom a todas las cartas hover
            //     $("#sobre" + (index)).removeClass('zoom2'); //quitar zoom a todas las cartas hover
            // }
            for (let index = 0; index < me.txt_equipos; index++) {
                $("#btn" + index).removeClass('btn');
            }
            if (me.inc_equipos >= me.txt_equipos) {
                me.inc_equipos = 0;
            }
            $("#btn" + me.inc_equipos).addClass('btn');
            me.inc_equipos++;
            me.intervalid1 = setInterval(function () {
                if (me.repe < me.repeticion) {
                    if (me.inc < me.total_cartas_numbers.length) {
                        rdn1 = (Math.floor(Math.random() * (me.total_cartas_numbers.length)));
                        $("#img" + me.total_cartas_numbers[rdn1]).addClass('zoom1');
                        // $("#img" + me.total_cartas_numbers[me.inc]).addClass('zoom1');
                        me.inc++;
                    } else {
                        me.inc = 0;
                        me.repe++;
                    }
                } else {
                    me.repe = 0;
                    me.f_mostrar();
                    clearInterval(me.intervalid1)
                }
            }, 150);
            setTimeout(function () {
                me.intervalid2 = setInterval(function () {
                    if (me.repe < me.repeticion) {
                        if (nn < me.total_cartas_numbers.length) {
                            // $("#img" + me.total_cartas_numbers[nn]).removeClass('zoom1')
                            $("#img" + me.total_cartas_numbers[rdn1]).removeClass('zoom1')
                            nn++;
                        } else {
                            nn = 0;
                        }
                    } else {
                        clearInterval(me.intervalid2)
                    }
                }, 150);
            }, 100);
        },
        f_mostrar() {
            let me = this;
            let rdn = 0;
            let n_img = 0;
            me.res_carta = '';
            rdn = (Math.floor(Math.random() * (me.total_cartas_numbers.length)));
            n_img = me.total_cartas_numbers[rdn]; //obtener el numero de imagen hover a mostrar
            me.res_carta = me.cartas[n_img - 1]
            me.total_cartas_numbers.splice(rdn, 1); //quitar el numero de la carta, para q ya no juegue
            // console.log(rdn, n_img, me.total_cartas_numbers, me.cartas, me.cartasTmp, me.res_carta.src)
            $("#img" + n_img).hide(); //ocultar la portada
            $("#num" + n_img).hide(); //ocultar el numero
            $("#sobre" + n_img).removeClass('zoom0'); //quitar el zoom0
            $("#sobre" + +n_img).show(); //mostrar la carta hover
            $("#sobre" + n_img).addClass('zoom2'); //agregar zoom1 a la carta mostrada

            me.modal_carta_elegida = true;
            if (me.total_cartas_numbers.length == 0) {
                me.f_quitar_zoom();
                this.btn_visible = false; //si esta vacio el array, ocultar el boton jugar y mostrar resultados
                // this.f_resultados();
            }
        },
        f_resultados() {
            let me = this;
            me.modal_resultados = true
            me.arr_equipos.sort((a, b) => Number(b.puntos) - Number(a.puntos));

        },
        f_reto(val) {
            let me = this;
            me.modal_carta_elegida = false;
            if (val == 1) {
                me.arr_equipos[me.inc_equipos - 1].puntos += 1;
            } else {
                if (me.arr_equipos[me.inc_equipos - 1].puntos > 0) {
                    me.arr_equipos[me.inc_equipos - 1].puntos -= 0.5
                }
            }
        },
        f_quitar_zoom() {
            let me = this;
            for (let index = 1; index <= me.cartas.length; index++) {
                $("#sobre" + (index)).addClass('zoom0'); //quitar zoom a todas las cartas hover
                $("#sobre" + (index)).removeClass('zoom2'); //quitar zoom a todas las cartas hover
            }
        }
    },
}
</script>

<style lang="css" scoped>
.caja-equipo {
    border: #360202 solid 1px;
    padding: 5px;
    border-radius: 10px;

}

.btn {
    /* position: relative; */
    display: block;
    color: rgb(17, 3, 3);
    font-size: 14px;
    font-family: "montserrat";
    text-decoration: none;
    margin: 30px 0;
    border: 5px solid #360202;
    text-transform: uppercase;
    overflow: hidden;
    transition: 0.5s all ease;
    font-weight: 900;

    -webkit-box-shadow: 5px 7px 28px 9px rgba(117, 115, 117, 1);
    -moz-box-shadow: 5px 7px 28px 9px rgba(117, 115, 117, 1);
    box-shadow: 5px 7px 28px 9px rgba(117, 115, 117, 1);
}

.btn::before {
    background: #ff7675;
    content: "";
    /* position: absolute; */
    top: 50%;
    left: 50%;
    /* transform: translate(-50%,-50%); */
    z-index: -1;
    transition: all 0.5s ease;
}

.btn1::before {
    width: 100%;
    height: 100%;
}

.color1 {
    background-color: rgb(249, 242, 230);
}

.zoom1 {
    transform: scale(1.2)
}

.zoom2 {
    transform: scale(1);
    animation: pulse 2s infinite;
    z-index: 99;
}

.zoom0 {
    transform: scale(1)
}

.numero {
    font-size: 25px;
    font-weight: 800;
    position: absolute;
    margin-left: 15px;
    background-color: #fff;
    padding: 8px;
    border-radius: 15px;
    z-index: 99;
}

/* CARDS */

.cards {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
}

.card {
    margin: 5px;
    padding: 5px;
    width: 200px;
    min-height: 200px;
    display: grid;
    grid-template-rows: 20px 50px 1fr 50px;
    border-radius: 10px;
    box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.25);
    transition: all 0.2s;
}

.card-big {
    margin: 5px;
    padding: 5px;
    width: 350px;
    min-height: 350px;
    display: grid;
    grid-template-rows: 20px 50px 1fr 50px;
    border-radius: 10px;
    box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.25);
    transition: all 0.2s;
}

.card:hover {
    box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.4);
    transform: scale(1.01);
}

.valor-equipo {
    font-weight: bolder;
    padding: 10px;
    margin: 0 30px;
    background-color: #EBE8E2;
    border-radius: 25px;
}

/* RESPONSIVE */

@media (max-width: 1600px) {
    .cards {
        justify-content: center;
    }
}

@keyframes pulse {
    0% {
        transform: scale(1.1);
        box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.7);
    }

    60% {
        transform: scale(1.2);
        box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
    }

    100% {
        transform: scale(1.1);
        box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.7);
    }
}
</style>
