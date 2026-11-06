<template>
<div class="vx-col md:w-full w-full mb-base">
    <vx-card class="vx-col md:w-full w-full mb-base">        
            <vs-button style="display: inline-block;" size="small"  to="/certificados" color="success" type="border">Volver</vs-button>
        <div class="vx-row m-3" v-if="todoEncuestas.length > 0">
            <div class="vx-col sm:w-full text-right" style="margin-top:-20px">
                <div v-if="todoEncuestas.length>1">
                    <vx-tooltip style="display: inline-block;" text="Anterior" position="top" color="success">
                        <vs-button style="display: inline-block;" size="small" radius icon-pack="feather" @click="prev()" icon="icon-chevron-left" color="success" type="gradient"></vs-button>
                    </vx-tooltip>
                    <vx-tooltip style="display: inline-block;" text="Siguiente" position="top" color="success">
                        <vs-button style="display: inline-block;" size="small" radius icon-pack="feather" @click="next()" icon="icon-chevron-right" color="success" type="gradient"></vs-button>
                    </vx-tooltip>
                </div>
                <small>Total respuestas: <b>{{num+1}} de {{todoEncuestas.length}}</b> </small> <br>
            </div>
            <h5 class=" vx-col sm:w-full"> <small>Seminario: </small> {{name_seminario}} </h5>
            <vs-divider>Datos personales</vs-divider>
            <div class="mb-base vx-col sm:w-full">Nombre: <b>{{todoEncuestas[num].nombres}} {{todoEncuestas[num].apellidos}}</b></div>
            <div class="mb-base vx-col sm:w-full">Email: <b>{{todoEncuestas[num].email}}</b></div>
            <div class="mb-base vx-col sm:w-full">Institución: <b>{{todoEncuestas[num].nombreInstitucion}}</b></div>
            <vs-divider>Aspectos sobre el capacitador</vs-divider>
            <div class="mb-base vx-col sm:w-2/3">Puesto en que se desempeña</div>
            <div class="mb-base vx-col sm:w-1/3">{{todoEncuestas[num].p1}} </div>
            <div class="mb-base vx-col sm:w-2/3">Indicó con claridad los objetivos del taller</div>
            <div class="mb-base vx-col sm:w-1/3">{{todoEncuestas[num].p2}} </div>
            <div class="mb-base vx-col sm:w-2/3">Fue claro en su explicación y en el desarrollo del tema</div>
            <div class="mb-base vx-col sm:w-1/3">{{todoEncuestas[num].p3}} </div>
            <div class="mb-base vx-col sm:w-2/3">Fomentó la participación activa de los asistentes</div>
            <div class="mb-base vx-col sm:w-1/3">{{todoEncuestas[num].p4}} </div>
            <div class="mb-base vx-col sm:w-2/3">Interactuó de manera oportuna con los participantes</div>
            <div class="mb-base vx-col sm:w-1/3">{{todoEncuestas[num].p5}} </div>
            <vs-divider>Indicadores sobre el contenido de la capacitación</vs-divider>
            <div class="mb-base vx-col sm:w-2/3">Considero que la información recibida me servirá para mejorar mi práctica docente</div>
            <div class="mb-base vx-col sm:w-1/3">{{cambio(todoEncuestas[num].p6)}} </div>
            <div class="mb-base vx-col sm:w-2/3">Las actividades realizadas fueron útiles para reforzar el contenido del taller</div>
            <div class="mb-base vx-col sm:w-1/3">{{cambio(todoEncuestas[num].p7)}} </div>
            <div class="mb-base vx-col sm:w-2/3">El contenido fue relevante y adecuado al título del taller</div>
            <div class="mb-base vx-col sm:w-1/3">{{cambio(todoEncuestas[num].p8)}} </div>
            <vs-divider>Duración de la sesión</vs-divider>
            <div class="mb-base vx-col sm:w-2/3">¿Cómo considera la duración de la sesión?</div>
            <div class="mb-base vx-col sm:w-1/3">{{todoEncuestas[num].p9}} </div>
            <div class="mb-base vx-col sm:w-2/3">¿En qué medida se siente satisfecho del contenido de la capacitación recibida?</div>
            <div class="mb-base vx-col sm:w-1/3">{{todoEncuestas[num].p10}}</div>
            <vs-divider>Comentarios - Sugerencias</vs-divider>
            <div class="mb-base vx-col sm:w-1/2">¿Qué sugerencia nos propone para mejorar próximas experiencias de aprendizaje?</div>
            <div class="mb-base vx-col sm:w-1/2">{{todoEncuestas[num].p11}} </div>
            <div class="mb-base vx-col sm:w-1/2">¿Qué temas le gustaría que tratáramos en las siguientes capacitaciones?</div>
            <div class="mb-base vx-col sm:w-1/2">{{todoEncuestas[num].p12}} </div>
        </div>
        <div v-else class="text-center"> Ningún docente ha respondido esta encuesta. </div>
    </vx-card>
</div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import vSelect from 'vue-select'
Vue.use(axios)
export default {
    components: {
        'v-select': vSelect,
    },
    data() {
        return {
            todoEncuestas: [],
            num: 0,
            name_seminario: '',
            estrellasT: [],

        }
    },
    mounted() {
        this.idSeminario = localStorage.getItem('idSemi')        
        this.semiName = localStorage.getItem('semiName')   
        this.getEncuestas_X_Seminario(this.idSeminario,this.semiName);
    },
    methods: {       
        getEncuestas_X_Seminario(item, name) {
            let me = this;
            me.$vs.loading()
            me.name_seminario = name
            me.num = 0;
            this.$http.get(this.$server_url+'encuesta_certificados/' + item)
                .then(function (response) {
                    me.todoEncuestas = response.data
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    me.$vs.loading.close()
                })
        },
        next() {
            let me = this;
            me.num < me.todoEncuestas.length - 1 ? me.num++ : me.num;
            // console.log(me.num, 'total ' + me.todoEncuestas.length)
        },
        prev() {
            let me = this;
            me.num > 0 ? me.num-- : me.num;
            // console.log(me.num)

        },
        cambio(respuesta) {
            if (respuesta == 'mal') {
                return 'Totalmente en desacuerdo';
            } else if (respuesta == 'regular') {
                return 'Parcialmente en desacuerdo';
            } else if (respuesta == 'bien') {
                return 'Parcialmente de acuerdo';
            } else if (respuesta == 'excelente') {
                return 'En total acuerdo';
            } else {
                return respuesta;
            }
        }
    },
}
</script>
