<template>
<div>
    <!--MENU-->
    <div class="flex">
        <small>Seleccione la institución:</small>
        <v-select :options="array" :reduce="(array) => array" density="comfortable" label="ven_codigo" class="w-full" placeholder="--Seleccione--" v-model="documentos" @input="getInfoventa()" required />
    </div>
    <!--COMPONENTES-->
    <div>
        <vs-table class="table users table-hover" :data="datos">
            <template slot="thead">
                <vs-th width="50"> # </vs-th>
                <vs-th width="500"> Detalle del producto </vs-th>
                <vs-th width="300"> Cantidad facturado</vs-th>
                <vs-th width="300"> Cantidad despachar</vs-th>
            </template>
            <template slot-scope="{ data }">
                <vs-tr v-for="(inputvs, k) in data" :key="k">
                    <vs-td><br /><b>{{ k + 1 }}</b></vs-td>
                    <vs-td>{{ inputvs.pro_codigo }} {{ inputvs.pro_nombre }}</vs-td>
                    <vs-td> {{ inputvs.det_ven_cantidad }}</vs-td>
                    <vs-td>
                        <vs-input class="w-full m-2" v-model="inputvs.despacho" :min="0" :step="1" :max="inputvs.det_ven_cantidad" type="number" @paste="handlePaste($event, inputvs)" @keypress="handleKeyPress($event, inputvs)" :ref="'inputvs_' + k" style="font-size: small;" />
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="mt-2" v-if="array.length>0">
            <vs-button @click="datosV();" type="relief" color="green">Excluir</vs-button>&emsp;
            <vs-button @click="cerrar();" color="danger" type="relief">Cancelar</vs-button>
        </vs-col>

    </div>

</div>
</template>

<script>
import vSelect from "vue-select";
export default {
    components: {
        "v-select": vSelect,
    },
    data() {
        return {
            documentos: '',
            tipo: 0,
            array: [],
            dat: [],
            datos: [],
            activa: '',
        }
    },
    props: {
        arrayAsignados: {
            type: Array,
            default: () => []
        }
    },
    mounted() {
        let me = this;
        me.array = me.arrayAsignados;
        me.dat=[];
    },
    methods: {
        datosV() {
            let me = this;
            me.datos.forEach(p => {
                if (p.despacho == 0) {
                    me.dat.push(p.det_ven_codigo)
                }
            });
            console.log(me.dat);
            me.documentos = '';
            me.datos = [];
        },
        cerrar() {
            this.datos = [];
            this.documentos = '';
        },
        handleKeyPress(event, inputvs) {
            // Obtener el valor máximo permitido
            let maxValue = parseFloat(inputvs.det_ven_cantidad);
            // Obtener el valor ingresado
            let enteredValue = parseFloat(event.target.value + event.key);

            // Verificar si la tecla presionada es un número
            if (!/\d/.test(event.key)) {
                event.preventDefault();
                return;
            }

            // Si el valor ingresado excede el valor máximo permitido, prevenir la acción por defecto
            if (enteredValue > maxValue) {
                event.preventDefault();
                this.$vs.notify({
                    text: "No se permite el ingreso de valores mayor a cantidad faltante",
                    color: "danger",
                    iconPack: "feather",
                    icon: "icon-alert-triangle",
                });
            }
        },
        handlePaste(event, inputvs) {
            // Obtener el valor máximo permitido
            let maxValue;
            maxValue = parseFloat(inputvs.det_ven_cantidad);

            // Obtener el texto pegado
            let pastedText = (event.clipboardData || window.clipboardData).getData('text');

            // Verificar si el texto pegado contiene solo números
            if (!/^\d+$/.test(pastedText)) {
                event.preventDefault();
                return;
            }

            // Obtener el valor como número
            let pastedValue = parseFloat(pastedText);

            // Si el valor pegado excede el valor máximo permitido, ajustarlo
            if (pastedValue > maxValue) {
                // Detener la propagación del evento para evitar que se pegue el valor excedente
                event.preventDefault();

                // Actualizar el valor en el modelo de datos
                this.$set(inputvs, 'det_prof_cantidad', maxValue);

                // Actualizar el valor en el campo de entrada
                this.$refs['inputvs_' + this.input.indexOf(inputvs)][0].value = maxValue;
            }
        },
        getInfoventa() {
            let me = this;
            me.datos = [];
            var url = "";
            if (me.documentos == "" || me.documentos == null || me.documentos == undefined) {
                this.$vs.notify({
                    text: "Seleccione un documento",
                    color: "danger",
                    iconPack: "feather",
                    icon: "icon-alert-triangle",
                });
                return;
            } else {
                me.$vs.loading();
                url = "getDventas?id=" + me.documentos.ven_codigo+'&idemp='+me.documentos.id_empresa;

                this.$http.get(this.$server_url + url)
                    .then(res => {
                        me.$vs.loading.close()
                        if (res.data.length == 0) {
                            me.$vs.notify({
                                text: 'No hay actas/notas/facturas pendientes por despachar',
                                color: 'danger',
                                iconPack: 'feather',
                                icon: 'icon-x'
                            })
                        }
                        this.datos = res.data;

                    })
                    .catch(err => {
                        console.log(err)
                        me.$vs.loading.close()
                    });
            }
        },

    }
}
</script>
