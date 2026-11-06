<template>
<div>
    <div>
        <!--card para mover toda la nota o por libro-->
        <vx-card>
            <ul class="flex">
                <li class="mr-2">
                    Seleccione a mover:
                </li>
                <li class="mr-2">
                    <vs-radio v-model="radioTipo"  vs-name="radios1radioTipo" vs-value="0">Toda la nota</vs-radio>
                </li>
                <!-- <li class=mr-2>
              <vs-radio v-model="radioTipo" @input="start()" vs-name="radios1radioTipo" vs-value="1">Por libro</vs-radio>
          </li> -->
            </ul>
        </vx-card>
        <!--card para mover por nota-->
        <vx-card class="mt-2" v-if="radioTipo==0">
            <p class="text-center font-bold">Nota a mover: {{ObjectSelected.ven_codigo}}</p>
            <!--observacion-->
            <div class="mt-4">
                <vs-input class="w-full" v-model="observacion" placeholder="Observaciones"></vs-input>
            </div>
            <!--boton para mover nota-->
            <div class="flex justify-center mt-5">
                <vs-button color="primary" type="filled" @click="openConfirmMove()" class="mt-2">
                    Mover a Pre Factura
                </vs-button>
            </div>
            <!--card para mover nota por libro-->
        </vx-card>
    </div>
</div>
</template>

<script>
import Generalmix from "../../../../../mixins/Generalmix";
export default {
    mixins: [Generalmix],
    data() {
        return {
            radioTipo: 0,
            arrayMover: [],
            observacion: "",
        }
    },
    props: {
        periodo_id: {
            type: Number,
            default: 0
        },
        ObjectSelected: {
            type: Object,
            default: {}
        },
    },
    mounted() {},
    methods: {
        openConfirmMove() {
            let me = this
            if (me.observacion == "") {
                me.m_message('Debe agregar observaciones', 'warning')
                return
            }
            //controlar trim
            me.observacion = me.observacion.trim()
            let datos = {
                observacion: this.observacion
            }
            me.$emit('openConfirmMove', 0, datos)
        },
    }
}
</script>
