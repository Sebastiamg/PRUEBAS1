<template>
    <div>
        <div class="row">
            <ul class="flex">
                <li>
                    <vs-radio v-model="tipo" class="ml-2" vs-name="radios3tipo" vs-value="0" @input="filtroTipo(); contratoSelect=[]">Directa</vs-radio>
                </li>
                <li>
                    <vs-radio v-model="tipo" class="ml-2" vs-name="radios3tipo" vs-value="1" @input="filtroTipo(); contratoSelect=[]">Por lista</vs-radio>
                </li>

            </ul>
        </div>
        <vx-card>
            <vs-row vs-justify="center">
                <vs-col type="flex" vs-justify="center" vs-align="center" vs-w="6">
                  <div class="mt-5 flex justify-center">
                      <vs-button color="dark" v-if="contratoSelect.length > 0" icon="check" @click="agrupar();f_validateDiferentesAsesoresAgrupar();" class="p-3">Agregar {{ contratoSelect.length }} Pedidos</vs-button>
                  </div>
                </vs-col>
            </vs-row>
            <vs-table multiple v-model="contratoSelect" pagination max-items="25" search :data="tmpPedidos" v-if="tmpPedidos.length > 0">

                <template slot="header">
                    <vs-chip>Cantidad {{tmpPedidos.length}}</vs-chip>
                </template>
                <template slot="thead">
                    <vs-th># Pedido</vs-th>
                    <vs-th>Institución</vs-th>
                    <vs-th>Contratos</vs-th>
                    <vs-th>Asesor</vs-th>
                    <!-- <vs-th>Acciones</vs-th> -->
                </template>
                <template slot-scope="{data}">
                    <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                        <vs-td>{{tr.id_pedido}}</vs-td>
                        <vs-td>
                            <div>
                                <div style="width: 200px;" class="flex flex-col gap-2">
                                    <span class="flex font-bold">{{ tr.nombreInstitucion }}</span>
                                </div>
                                <div>
                                    <b class="text-danger">{{ tr.nombre_ciudad }}</b>
                                </div>
                            </div>
                        </vs-td>
                        <vs-td>
                            <div style="width: 200px;" class="flex flex-col gap-2">
                                <span class="flex font-bold">{{ tr.contrato_generado }}</span>
                            </div>
                        </vs-td>
                        <vs-td>
                            <div style="width: 200px;" class="flex flex-col gap-2">
                                <span class="flex font-bold">{{ tr.asesor }}</span>
                            </div>
                            <div>
                                <span class="text-xs">{{ tr.cedula_asesor }}</span>
                            </div>
                        </vs-td>
                        <!-- <vs-td>
                            <div>
                                <vs-button color="rgb(59,222,200)" type="line" class="w-full" @click="ver_pedido(tr)">Ver detalles</vs-button>
                            </div>
                        </vs-td> -->
                    </vs-tr>
                </template>
            </vs-table>
            <br><br><br><br><br><br><br><br><br><br><br><br><br>
        </vx-card>
        <vs-popup :title="`Agrupacion de Pedidos `" :active.sync="popupagrupa">
            <vs-alert title="Advertencia" active="true" color="#842993" icon="new_releases">
                Esta sección esta diseñada para agrupar los pedidos:
                * Se puede agrupar pedidos creando nuevos grupos.
                * Se puede agrupar pedidos dentro de un grupo ya existente.
            </vs-alert>
             <!--differentAsesores-->
             <div>
              <vs-alert v-if="differentAsesores" title="Advertencia" active="true" color="danger" icon="new_releases">
                  Los registros seleccionados a agrupar tienen diferentes asesores, <b>Tener en cuenta antes de guardar</b>
              </vs-alert>
              <br><br>
            </div>
            <vs-row vs-justify="center">
                <vs-col type="flex" vs-justify="center" vs-align="center" vs-w="12">
                    <div class="row">
                        <ul class="flex">
                            <li>
                                <vs-radio v-model="agrupa" class="ml-2" vs-name="radio" vs-value="0">Nueva</vs-radio>
                            </li>
                            <li>
                                <vs-radio v-model="agrupa" class="ml-2" vs-name="radio" vs-value="1">Existente</vs-radio>
                            </li>
                        </ul>
                    </div>
                    <div class="row flex" v-if="agrupa==0">
                        <vs-input label="Descripción:" class="w-full" v-model="descripcion" />
                    </div>
                    <div class="row flex" v-if="agrupa==1">
                        <v-select :options="opcion" @input="f_agruparExistente" :reduce="(opcion) => opcion" density="comfortable" label="ca_descripcion" class="w-full" value="id" placeholder="--Seleccione--" v-model="AgrupaOtro" />
                    </div>
                </vs-col>
            </vs-row>
            <br><br>
            <vs-table max-items="10" class="mt-2" stripe search pagination :data="contratoSelect">
                <template slot="header">
                    <vs-chip color="primary">Cantidad: <b> {{ contratoSelect.length }}</b></vs-chip>
                </template>
                <template slot="thead">
                    <th># pedido</th>
                    <vs-th>Contrato</vs-th>
                    <!-- <vs-th>Asesor</vs-th> -->
                </template>
                <template slot-scope="{data}">
                    <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                        <vs-td>
                            {{ tr.id_pedido}}
                        </vs-td>
                        <vs-td>
                            {{ tr.contrato_generado }} <br>
                            <b>{{ tr.nombreInstitucion }}</b> <br>
                            <b class="text-danger">{{ tr.nombre_ciudad }} </b><br>
                            <b>Asesor:</b> {{tr.asesor}}
                        </vs-td>
                    </vs-tr>
                </template>
            </vs-table>
            <br /><br />
            <div class="flex justify-center">
              <vs-button color="primary" @click="openConfirmGuardar">Guardar</vs-button>
                <vs-button class="ml-4" color="warning" @click="popupagrupa=false">Cancelar</vs-button>
            </div>
        </vs-popup>

    </div>
    </template>

    <script>
    import vSelect from 'vue-select';
    export default {
        components: {
            vSelect
        },
        data() {
            return {
                tipo: 0,
                pedido: [],
                tmpPedidos: [],
                arrayLibros: [],
                arrayTotales: [],
                despachoSelect: '',
                contratoSelect: [],
                contratos: [],
                popupagrupa: false,
                agrupa: 0,
                descripcion: '',
                AgrupaOtro: '',
                codigo: '',
                opcion: [],
                differentAsesores:false,
            }
        },
        created() {
            let me = this;
            me.usuario = JSON.parse(localStorage.getItem("usuario"))
            me.tipo = 0;
        },
        mounted() {
            let me = this;
            me.tipo = 0;
            me.getPedidos();
            //despues de 2 segundos
            // setTimeout(() => {
            //   me.filtroTipo();
            // }, 2000);
        },
        props: {
            periodoSelect: {
                type: Object,
                default: {},
            },
            userAsesor: {
                type: Boolean,
                default: false,
            },
            userRoot: {
                type: Boolean,
                default: false,
            },
            groupFacturador: {
                type: Boolean,
                default: false,
            },
        },
        watch: {
            pedidos(results) {
                let me = this;
                me.tmpPedidos = [];
                me.filtroTipo();
            },
        },
        methods: {
          f_validateDiferentesAsesoresAgrupar(){
            let me = this
            //si en contratoSelect hay diferente propiedad de asesor colocar la variable differentAsesores = true de lo contrario false
            me.differentAsesores = false
            let asesor = me.contratoSelect[0].asesor
            for (let i = 0; i < me.contratoSelect.length; i++) {
              if(asesor != me.contratoSelect[i].asesor){
                me.differentAsesores = true
                break
              }
            }
          },
          f_agruparExistente(){
            let me = this
            if(me.AgrupaOtro == null || me.AgrupaOtro == "" || me.AgrupaOtro == undefined){
              me.codigo = ""
            }else{
              me.codigo = me.AgrupaOtro.ca_codigo_agrupado
            }
          },
            agrupar() {
                let me = this;
                me.popupagrupa = true;
                // me.getcodi();
                me.getgrupos();
                if (me.tipo == 0) {
                    me.opcion = me.opcion.filter(p => p.ca_tipo_pedido == 1);
                } else if (me.tipo == 1) {
                    me.opcion = me.opcion.filter(p => p.ca_tipo_pedido == 2);
                }
                me.opcion = me.opcion.filter(p => p.facturacion_vee == 1)
                me.descripcion = '';
                me.AgrupaOtro = '';
                me.agrupa = 0;
            },
            async getgrupos() {
                let me = this;
                try {
                    const response = await this.$http.get(this.$server_url + "GetContratoagrupa?periodo="+me.periodoSelect.idperiodoescolar);
                    // const response = await this.$http.get(this.$server_url + "GetContratoagrupa?periodo="+me.periodoSelect.idperiodoescolar+"&tipo="+me.tipo);
                    if(me.tipo == 0) {
                        me.opcion = response.data.filter(p => p.ca_tipo_pedido == 1);
                    }else if(me.tipo == 1){
                        me.opcion = response.data.filter(p => p.ca_tipo_pedido == 2);
                    }
                    // me.opcion = response.data;
                    console.log('datos opcion',me.opcion)

                } catch (err) {
                    console.log(err);
                    throw err; // Propagate the error
                }
            },
            getPedidos() {
                let me = this
                var ruta = ""
                me.pedido = []
                if (me.periodoSelect == null || me.periodoSelect == "" || me.periodoSelect == undefined) {
                    return
                }
                var ruta = this.$server_url + 'get_pedidos_periodoAgrupado/' + me.periodoSelect.idperiodoescolar
                me.$vs.loading();
                this.$http.get(ruta)
                .then(res => {
                    me.$vs.loading.close();
                    let datos = res.data.filter(p => p.facturacion_vee == 1)
                    me.pedido = datos
                    me.filtroTipo();
                })
                .catch((e) => {
                    me.$vs.loading.close();
                })
            },
            filtroTipo() {
                let me = this;
                me.tmpPedidos = []

                //TIPO VENTA=============
                //Venta directa
                if (me.tipo == 0) {
                  console.log("uno")
                    let datos = me.pedido.filter(p => p.tipo_venta == 1 && p.ca_codigo_agrupado == null && p.estado == 1 && ((p.contrato_generado != null)));
                    me.tmpPedidos = datos;
                }
                //Venta Lista
                if (me.tipo == 1) {
                  console.log("dos")
                    let datos = me.pedido.filter(p => p.tipo_venta == 2 && p.ca_codigo_agrupado == null && p.estado == 1 && ((p.contrato_generado != null)));
                    me.tmpPedidos = datos;
                }
            },
            // async getcodi() {
            //     let me = this;
            //     let ne, cod;
            //     try {
            //         const response = await this.$http.get(this.$server_url + "codigoAgrupacion?letra=AG");
            //         ne = response.data;
            //         if (ne != 0 || ne != null || ne != undefined) {
            //             cod = 'AG-' + ne;
            //         } else {
            //             me.$vs.notify({
            //                 text: "Verifique que seq correctael codigo",
            //                 color: "danger",
            //                 iconPack: "feather",
            //                 icon: "icon-x",
            //             });
            //         }
            //         console.log(cod);
            //         me.codigo = cod;
            //     } catch (err) {
            //         console.log(err);
            //         throw err; // Propagate the error
            //     }
            // },
            openConfirmGuardar() {
                let me = this
                if (me.contratoSelect.length == 0) {
                    me.$vs.notify({
                        text: 'Se debe al menos agregar un pedido para agrupar',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-x'
                    })
                    return
                }
                if (me.agrupa == 0 && (me.descripcion.trim() == null || me.descripcion.trim() == "" || me.descripcion.trim() == undefined)) {
                    me.$vs.notify({
                        text: 'Ingrese la descripcion del grupo.',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-x'
                    })
                    return
                }
                if (me.agrupa == 1 && (me.AgrupaOtro == null || me.AgrupaOtro == "" || me.AgrupaOtro == undefined)) {
                    me.$vs.notify({
                        text: 'Seleccione el grupo pa el pedido.',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-x'
                    })
                    return
                }
                me.guardar();
            },
            guardar() {
                let me = this;
                let formData = new FormData();
                formData.append('id_periodo',me.periodoSelect.idperiodoescolar)
                formData.append('user_created', me.usuario.idusuario);
                if (me.agrupa == 0) {
                    formData.append('agrupa', me.agrupa);
                    formData.append('ca_descripcion', me.descripcion);
                    // formData.append('ca_codigo_agrupado', me.codigo);
                    if (me.tipo == 0) {
                        formData.append('ca_tipo_pedido', 1);
                    } else if (me.tipo == 1) {
                        formData.append('ca_tipo_pedido', 2);
                    }
                    formData.append('ca_cantidad', me.contratoSelect.length);
                    formData.append('ca_estado', 1);
                    formData.append('pedidos', JSON.stringify(me.contratoSelect));
                } else if (me.agrupa == 1) {
                  if(me.codigo == null || me.codigo == "" || me.codigo == undefined){
                      me.$vs.notify({
                        text: "Seleccione un grupo por favor",
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-check'
                      })
                      return
                    }
                    formData.append('agrupa', me.agrupa);
                    formData.append('id', me.codigo);
                    // formData.append('ca_codigo_agrupado', me.AgrupaOtro.ca_codigo_agrupado);
                    formData.append('ca_cantidad', me.contratoSelect.length)
                    formData.append('pedidos', JSON.stringify(me.contratoSelect));
                }
                me.$vs.loading()
                this.$http.post(this.$server_url + 'RegistroAgrupacion', formData)
                    .then(res => {
                        me.$vs.loading.close()
                        if(res.data.status == 0) {
                            me.$vs.notify({
                                text: res.data.message,
                                color: 'warning',
                                iconPack: 'feather',
                                icon: 'icon-check',
                                time:6000
                            })
                            me.popupagrupa = false;
                            return
                        }
                        if(res.status == 0){
                            me.$vs.notify({
                                text: res.data.message,
                                color: 'danger',
                                iconPack: 'feather',
                                icon: 'icon-check'
                            })
                            me.popupagrupa = false;
                            return
                        }
                        if (res.status === 200) {
                            me.$vs.notify({
                                text: res.data.message,
                                color: 'success',
                                iconPack: 'feather',
                                icon: 'icon-check'
                            });
                            me.popupagrupa = false;
                        }
                        if (res.status === 500) {
                            me.$vs.notify({
                                text: res.data.message,
                                color: 'danger',
                                iconPack: 'feather',
                                icon: 'icon-check'
                            })

                            me.popupagrupa = false;
                        }
                        setTimeout(() => {
                          me.getPedidos();
                          me.contratoSelect = [];
                        }, 1000);
                    })
                    .catch((e) => {
                        me.$vs.loading.close()
                        me.$vs.notify({
                            text: 'No se pudo agrupar',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-check'
                        })
                        me.popupagrupa = false;
                    });
            },
            ver_pedido(item) {
                let me = this
                this.$store.dispatch('setPedido', item)
                localStorage.setItem("id_periodo_selected", this.id_periodo)
                localStorage.setItem("nombre_periodo_selected", this.nombre_periodo)
                localStorage.setItem("contrato_generado", item.contrato_generado)
                localStorage.setItem("pedido_desde_admin", 'activo')
                localStorage.setMenu = 0
                me.$emit('showPedido', 4)
            },
        }
    }
    </script>

    <style>
    .fixed-column {
        position: sticky;
        left: 0;
        background-color: white;
    }

    .fixed-column2 {
        position: sticky;
        top: 0;
        background-color: white;
    }

    .popup-footer {
        position: absolute;
        bottom: 0;
        width: 100%;
        padding: 20px;
        /* Espacio interno alrededor de los botones */
        background-color: #f0f0f0;
        /* Color de fondo del footer */
        box-shadow: 0 -2px 6px rgba(0, 0, 0, 0.1);
        /* Sombra en la parte inferior */
    }
    </style>
