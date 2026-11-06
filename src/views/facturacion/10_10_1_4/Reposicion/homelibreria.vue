<template>
    <div>
        <!-- <h1 class="page-title font-bold">Dashboard</h1> -->
        <!-- <vs-row>
            <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" vs-type="flex" class="m-2">
                <vs-col vs-justify="center" vs-align="center" vs-w="10" class="m-3">
                    <vx-card content-color="#5850d5" card-background="#fdf4f3" style="padding: 10px">
                        <img style="float: right; width: 80px; margin-top: 1px" src="https://cdn-icons-png.flaticon.com/512/3967/3967160.png" @click="$router.push('/pedidos/libreria')">
                        <p style="padding-bottom: 2vw"><b style="color: #788593; font-size: 2vw;">Grupos de solicitudes disponibles {{ pedido.length }}</b></p>
                        <small v-for="(tr,k) in pedido" :key="k">
                            <div>
                                <b color="#078BC8">{{tr.ca_descripcion}}</b> # <span>{{tr.ca_codigo_agrupado}}</span>
                                <vs-list>
                                    <vs-list-header :title="`Solicitudes: ${tr.total}`"></vs-list-header>
                                    <vs-list-item>
                                      <b>Anuladas: </b>{{tr.anulado }}
                                      <vs-button @click="$router.push('/pedidos/libreria')" size="small" class="p-3 ml-2"><i class="fa-regular fa-pen-to-square"></i> Ver detalles</vs-button>
                                    </vs-list-item>
                                    <vs-list-item class="mt-2">
                                      <b>Finalizadas: </b>{{tr.finalizado }}
                                      <vs-button @click="$router.push('/pedidos/libreria')" size="small" class="p-3 ml-2"><i class="fa-regular fa-pen-to-square"></i> Ver detalles</vs-button>
                                    </vs-list-item>
                                    <vs-list-item class="mt-2">
                                      <b>En proceso: </b>{{tr.pendiente }}
                                      <vs-button @click="$router.push('/pedidos/libreria')" size="small" class="p-3 ml-2"><i class="fa-regular fa-pen-to-square"></i> Ver detalles</vs-button>
                                    </vs-list-item>
                                </vs-list>
                            </div>
                        </small>
                    </vx-card>
                </vs-col>
            </vs-col>
        </vs-row>
        <vs-row>
            <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" vs-type="flex" class="m-2">
                <vs-col vs-justify="center" vs-align="center" vs-w="10" class="m-3">
                    <vx-card title="Grupos de solicitudes disponibles" title-color="#333399" content-color="#333399" card-background="#D5E4FC" v-if="datos.length>0" >
                        <div class="vx-row">
                            <div class="vx-col w-full">
                                <ChartjsComponentPieChart :data="chartData" :options="chartOptions"></ChartjsComponentPieChart>

                            </div>
                        </div>
                    </vx-card>
                </vs-col>
            </vs-col>
        </vs-row> -->
        <div class="flex flex-wrap">
            <div class="w-full sm:w-1/2 lg:w-1/2 xl:w-1/2 p-2 cyan">
                <vx-card type="flex">
                    <div class="flex justify-between items-center">
                        <h2>Proformas</h2>
                        <b class="message_p ml-1 mt-1">{{ proformas.length }}</b>
                    </div>

                    <!-- <div>
                        <b class="ml-1 mt-1">Pendientes: {{ pendientes }}</b><br>
                        <b class="ml-1 mt-1">Aprobadas: {{ aprobadas }}</b><br>
                        <b class="ml-1 mt-1">Anuladas {{ anuladas }}</b><br>
                        <b class="ml-1 mt-1">Finalizadas: {{ finalizadas }}</b><br>
                    </div> -->

                    <div class="vx-row">
                        <div class="vx-col">
                            <apexchart type="pie" width="100%" :options="chartOptions" :series="series"></apexchart>
                        </div>
                    </div>

                    <!-- <img style="float: right; width: 80px; margin-top: 1px" src="https://cdn-icons-png.flaticon.com/512/8703/8703542.png" @click="$router.push('/pedidos/libreria')"> -->
                </vx-card>
            </div>
        </div>
    </div>
    </template>

    <script>
    // Importamos la librería ApexCharts
    import chart from "vue-apexcharts";

    export default {
        components: {
            apexchart: chart,
        },
        data() {
            return {
                pedido: [],
                agrupo: [],
                datos: [],
                usuario: '',
                id_periodo: '',          
                series: [],
                chartOptions: {
                    chart: {
                    width: 380,
                    type: 'pie',
                    },
                    labels: ['Pendientes', 'Finalizadas', 'Aprobadas', 'Anuladas'],
                    responsive: [{
                    breakpoint: 480,
                    options: {
                        chart: {
                        width: 200
                        },
                        legend: {
                        position: 'bottom'
                        }
                    }
                    }]
                },
                proformas:[],
                anuladas:'',
                pendientes:'',
                finalizadas:'',
                aprobadas:'',
                

            };
        },
        mounted() {
            const usuariorespo = localStorage.getItem("usuario");
            this.usuario = JSON.parse(usuariorespo);
            this.id_periodo = localStorage.getItem("periodo_id");
            // this.getpedidos();
            this.getproformas();
        },
        methods: {
            getpedidos() {
                let me = this;
                me.pedido = [];
                me.$http.get(me.$server_url + "Get_pedidoSolicitud?usuario=" + me.usuario.idusuario)
                    .then(function (re) {
                        me.pedido = re.data;
                        if(me.pedido.length>0){
                            me.enviar();
                        }

                        // this.enviar()
                    })
                    .catch(function (error) {
                        console.error('Error al obtener pedidos:', error);
                    });
            },
            getproformas(){
                let me = this;
                me.pedido = [];
                me.$http.get(me.$server_url + "Get_proformasCliente?usuario=" + me.usuario.idusuario)
                    .then(function (res) {
                        me.proformas = res.data;
                        me.anuladas = res.data.filter(p=> p.prof_estado == 0).length;
                        me.pendientes = res.data.filter(p=> p.prof_estado == 1).length;
                        me.finalizadas = res.data.filter(p=> p.prof_estado == 2).length;
                        me.aprobadas = res.data.filter(p=> p.prof_estado == 3).length;
                        me.series = [
                            me.pendientes,
                            me.finalizadas,
                            me.aprobadas,
                            me.anuladas 
                        ];
                        console.log(this.series);
                    })
                    .catch(function (error) {
                        console.error('Error al obtener pedidos:', error);
                    });
            },
            // getdatos(a) {
            //     let b;
            //     a.forEach((p, i) => {
            //         b = 1;
            //         this.$http
            //             .get(this.$server_url + `GetProfarmas?prof_id=${p.ca_codigo_agrupado}&tipo=${b}`)
            //             .then((res) => {
            //                 if (res.data && res.data.length > 0) {
            //                     this.datos = res.data;
            //                     if(this.datos.length>0){
            //                         let dats=this.datos;
            //                         let anular=dats.filter(p => p.prof_estado == 0);
            //                         let pendientes=dats.filter(p => p.prof_estado != 0&&p.prof_estado != 2);
            //                         let finalizar=dats.filter(p => p.prof_estado == 2);
            // const dt={
            //     id:p.ca_codigo_agrupado,
            //     anulada:anular.length,
            //     pendiente:pendientes.length,
            //     finalizado:finalizar.length,
            //     total:dats.length,
            // };
            //                         var cal = new  Object()
            //                         cal.id = p.ca_codigo_agrupado
            //                         cal.anulada = anular.length
            //                         cal.pendiente = pendientes.length
            //                         cal.finalizado = finalizar.length
            //                         cal.total=dats.length
            //                         this.agrupo.push(cal);
            //                     }

            //                 }
            //             })
            //             .catch((err) => {
            //                 console.log(err);
            //             });

            //     });

            // },
            // enviar() {
            //     this.datos = [
            //         me.pendientes,
            //         me.finalizadas,
            //         me.aprobadas,
            //     ];
            //     console.log(this.datos);
            //     const dato=this.datos;
            //     this.chartData.datasets[0].data.push(...dato);
            //     this.chartData.datasets[0].data = this.chartData.datasets[0].data.concat(cantidadArray);
            //     console.log(this.chartData);
            // },
            // cargardatos(a, array) {
            //     if (a == 0) {
            //         array.forEach((p) => {
            //             this.chartData.datasets[0].data.push(p.total);
            //         });
            //         console.log(this.chartData);
            //     }
            // },
        },
    };
    </script>

    <style scoped>
    /* Estilos opcionales para el contenedor */
    #grafica {
        width: 400px;
        height: 400px;
    }

    .row1-container {
        font-size: 15px;
        font-family: 'Poppins', sans-serif;
        background-color: hsl(0, 0%, 98%);
    }

    .attribution {
        font-size: 11px;
        text-align: center;
    }

    .attribution a {
        color: hsl(228, 45%, 44%);
    }

    h1:first-of-type {
        font-weight: 200;
        color: hsl(234, 12%, 34%)
    }

    h1:last-of-type {
        color: hsl(234, 12%, 34%)
    }

    @media (max-width: 400px) {
        h1 {
            font-size: 1.5rem;
        }
    }

    .box p {
        color: hsl(229, 6%, 66%);
    }

    .box {
        border-radius: 5px;
        box-shadow: 0px 30px 40px -20px hsl(229, 6%, 66%);
        padding: 30px;
        margin: 20px;
        background-color: white;
        cursor: pointer;
        transition: 1s ease;
    }

    .box:hover {
        box-shadow: 15px 10px 15px #0000;
    }

    img {
        float: right;
    }

    /*ESTILOS NOTIFICACIONES */
    .message_p {
        background: #06d755;
        color: #fff;
        min-width: 20px;
        height: 23px;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 18px;
        width: 23px;
    }

    @media (max-width: 912px) {
        .box {
            width: 100% !important;
        }

        img {
            margin-top: -40px;
            width: 50px;
        }
    }

    @media (max-width: 820px) {
        .box {
            width: 100% !important;
        }

        img {
            margin-top: -40px;
            width: 50px;
        }
    }

    @media (max-width: 450px) {
        .box {
            height: 200px;
        }

        .img {
            margin-top: -40px;
        }
    }

    @media (max-width: 400px) {

        img {
            margin-top: -40px;
            width: 50px;
        }
    }

    @media (max-width: 414px) {
        .box {
            width: 100% !important;
        }

        img {
            margin-top: -40px;
            width: 50px;
        }
    }

    @media (max-width: 375px) {
        .box {
            width: 100% !important;
        }

        img {
            margin-top: -40px;
            width: 50px;
        }
    }

    @media (max-width: 280px) {
        .box {
            width: 100% !important;
        }

        img {
            margin-top: -40px;
            width: 50px;
        }
    }

    @media (max-width: 950px) and (min-width: 450px) {
        .box {
            text-align: center;
            height: 180px;
        }
    }

    .cyan {
        border-top: 3px solid hsl(180, 62%, 55%);
    }

    .red {
        border-top: 3px solid hsl(0, 78%, 62%);
    }

    .blue {
        border-top: 3px solid hsl(212, 86%, 64%);
    }

    .orange {
        border-top: 3px solid hsl(34, 97%, 64%);
    }

    h2 {
        color: hsl(234, 12%, 34%);
        font-weight: 600;
    }

    @media (min-width: 950px) {
        .row1-container {
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .row2-container {
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .box-down {
            position: relative;
            top: 150px;
        }

        .box {
            width: 28%;

        }

        .header p {
            width: 30%;
        }

    }
    </style>
