<template>
<div class="mt-5">
    <!-- <v-select :options="arrayLibros" :reduce="arrayLibros => arrayLibros.pro_codigo" label="pro_nombre" class="w-full h-100 ml-2" placeholder="--Seleccione--" v-model="SelectLibro" @input="actualizarLibro" /> -->

    <div class="flex justify-center mt-5">
        <b>TIPO DE VENTA:</b>
        <ul class="flex justify-center">
            <li class="radio-item mx-5">
                <input type="radio" v-model="tipoVenta" @change="getXlibro();" name="radios1tipoVenta" value="1" id="directa">
                <label for="directa">Directa</label>
            </li>
            <li class="radio-item mx-5">
                <input type="radio" v-model="tipoVenta" @change="getXlibro();" name="radios1tipoVenta" value="2" id="lista">
                <label for="lista">Lista</label>
            </li>
        </ul>
    </div>

    <div class="flex justify-center mt-5">
        <b>EMPRESA:</b>
        <ul class="flex justify-center">
            <li class="radio-item mx-5">
                <input type="radio" v-model="Empresa" @change="getXlibro();" name="radios1Empresa" value="1" id="prolipa" :disabled="tipoVenta == null">
                <label for="prolipa">Prolipa</label>
            </li>
            <li class="radio-item mx-5">
                <input type="radio" v-model="Empresa" @change="getXlibro();" name="radios1Empresa" value="3" id="calmed" :disabled="tipoVenta == null">
                <label for="calmed">Calmed</label>
            </li>
        </ul>
    </div>

    <!-- <div class="flex justify-center mt-5 space-x-10 p-4 bg-gray-100 rounded-lg shadow-md">
        <div class="me-4 fw-semibold text-primary">
            📚 <b>CANTIDAD TOTAL: <span>{{ totalLibros }}</span></b>
        </div>
        <div class="fw-semibold text-success">
            💰 <b>TOTAL VALOR: <span>{{ ValorTotal | filtrarDecimal }}</span></b>
        </div>
    </div> -->

    <div>
        <TableReutilizableVue :title="`Despacho X Libro ${libro}`" :headers="['Codigo', 'Nombre','Empresa','Cantidad','Precio. Unit.','Total']" :fieldKeys="['pro_codigo','pro_nombre', 'empresa','cantidadReal','det_ven_valor_u','precio']" :ifexportar="Number(1)" :tableData="resultados" :nombrearchivo="`Despacho X Libro ${libro}`" />
    </div>
</div>
</template>

<script>
import {
    mapState
} from "vuex";
import vSelect from "vue-select";
import Generalmix from "../../../../../mixins/Generalmix";
const TableReutilizableVue = () => import('@/views/pedidos2/pedidos/reportes/components/TableReutilizable.vue')
export default {
    mixins: [Generalmix],
    components: {
        "v-select": vSelect,
        TableReutilizableVue
    },
    data() {
        return {
            //radios
            tipoVenta: null,
            Empresa: null,
            //datos libros
            arrayLibros: [],
            SelectLibro: null,
            resultados: [],
            totalLibros: 0,
            libro: '',
            ValorTotal: 0,
        };
    },
    props: {
        periodo_id: {
            type: Number,
            default: 0,
        },
        nombrePeriodo: {
            type: String,
            default: '',
        },
        periodoSelect: {
            type: Object,
            default: function () {
                return {}
            }
        },
    },
    mounted() {
        let me = this;
        // me.getLibros();
    },
    methods: {
        actualizarLibro() {
            if (this.SelectLibro == null) {
                this.limpiar();
            } else {
                this.resultados = [];
                this.totalLibros = 0;
                this.ValorTotal = 0;
                this.libro = '';
                let libroEncontrado = this.arrayLibros.find(l => l.pro_codigo == this.SelectLibro);
                this.libro = libroEncontrado ? libroEncontrado.pro_nombre : '';
            }
        },
        getLibros() {
            let me = this;
            me.$vs.loading();
            this.$http.get(this.$server_url + 'despachos?busquedaLibro=yes&periodo=' + me.periodo_id)
                .then(function (res) {
                    me.arrayLibros = res.data;
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()
                })
        },
        getXlibro() {
            let me = this;
            if (me.tipoVenta == null || me.Empresa == null) {
                me.$vs.notify({
                    title: 'Error',
                    text: 'Debe seleccionar TIPO DE VENTA y EMPRESA',
                    color: 'danger'
                })
                return
            }
            me.$vs.loading();
            // this.$http.get(this.$server_url + 'despachos?Xlibro=yes&periodo=' + me.periodo_id + '&tipoVenta=' + me.tipoVenta + '&pro_codigo=' + me.SelectLibro + '&empresa=' + me.Empresa)
            this.$http.get(this.$server_url + 'despachos?Xlibro=yes&periodo=' + me.periodo_id + '&tipoVenta=' + me.tipoVenta + '&empresa=' + me.Empresa)
                .then(function (res) {

                    me.resultados = res.data;

                    me.resultados.forEach(function (item) {
                        item.empresa = item.id_empresa == 1 || item.id_empresa == 6 ? 'Prolipa' : 'Calmed'
                        item.cantidadReal = item.cantidadReal * 1
                        me.totalLibros += item.cantidadReal * 1
                        item.precio = (item.det_ven_valor_u * (item.cantidadReal)).toFixed(2) * 1
                        me.ValorTotal += item.precio * 1
                    });

                    // let libroEncontrado = me.arrayLibros.find(l => l.pro_codigo == me.SelectLibro);
                    // this.libro = libroEncontrado ? libroEncontrado.pro_nombre : '';
                    console.log(me.libro);

                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()
                })
        },
        limpiar() {
            this.SelectLibro = null
            this.resultados = []
            this.tipoVenta = null
            this.Empresa = null
            this.totalLibros = 0
            this.ValorTotal = 0
            this.libro = ''
        }
    }
}
</script>

<style scoped>
.flex {
    display: flex;
    gap: 1rem;
    /* Espaciado entre los elementos */
}

.radio-item {
    display: flex;
    align-items: center;
    font-size: 16px;
    color: #333;
}

/* Ocultar los radios nativos y usar etiquetas personalizadas */
.radio-item input[type="radio"] {
    display: none;
}

/* Estilos para las etiquetas que imitan los radios */
.radio-item label {
    position: relative;
    padding-left: 30px;
    /* Espacio para el círculo del radio */
    cursor: pointer;
    font-weight: 600;
    transition: color 0.3s ease;
}

/* Crear el círculo personalizado */
.radio-item label::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    height: 20px;
    border: 2px solid #007bff;
    border-radius: 50%;
    background-color: #fff;
    transition: background-color 0.3s, border-color 0.3s;
}

/* Estilo cuando el radio está seleccionado */
.radio-item input[type="radio"]:checked+label::before {
    background-color: #007bff;
    border-color: #007bff;
}

/* Cambio de color en el texto del label cuando se selecciona */
.radio-item input[type="radio"]:checked+label {
    color: #007bff;
}

/* Estilos de hover y foco */
.radio-item label:hover {
    color: #0056b3;
}

.radio-item input[type="radio"]:focus+label::before {
    border-color: #0056b3;
}
</style>
