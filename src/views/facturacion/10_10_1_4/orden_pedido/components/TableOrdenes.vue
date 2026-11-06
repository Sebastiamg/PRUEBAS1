<template>
    <div>
        <vs-table max-items="10" search pagination :data="Ordentrabajo">
            <template slot="header">
                <vs-chip color="primary">Cantidad: <b> {{ Ordentrabajo.length }}</b></vs-chip>
            </template>
            <template slot="thead">
                <vs-th> Código </vs-th>
                <vs-th>Empresa</vs-th>
                <vs-th>Proveedor</vs-th>
                <vs-th>Usuario Creador</vs-th>
                <vs-th>Fecha Creación</vs-th>
                <vs-th>Observación</vs-th>
                <vs-th>Estado</vs-th>
                <vs-th style="width:100px;">Acciones</vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td>
                        {{ tr.or_codigo }}
                    </vs-td>
                    <vs-td> {{ tr.nombreEmpresa }} </vs-td>
                    <vs-td> {{ tr.prov_nombre }} </vs-td>
                    <vs-td>{{ tr.nombres }} {{ tr.apellidos }} </vs-td>
    
                    <vs-td>{{ tr.or_fecha }}</vs-td>
                    <vs-td>{{ tr.or_observacion }}</vs-td>
    
                    <vs-td>
                        <vs-chip v-if="tr.or_estado == 1" color="warning">Pendiente</vs-chip>
                        <vs-chip v-if="tr.or_estado == 2" color="success">Finalizado</vs-chip>
                    </vs-td>
                    <vs-td :data="tr.or_codigo">
                        <vs-dropdown vs-custom-content vs-trigger-click title="Opciones">
                            <vs-button class="a-icons" href.prevent icon="more_vert" type="border"></vs-button>
                            <vs-dropdown-menu style="width: 250px" class="cursor">
                                <vs-dropdown-item>
                                    <vs-button v-if="tr.or_estado == 1" color="#046AE7" type="line" class="w-full" @click="
                                            popupActivo = true;
                                            $emit('getEditar',tr)
                                        ">Editar</vs-button>
                                    <vs-button color="#8F4897" type="line" class="w-full" @click="
                                            popupActivo = true;
                                            $emit('getDeta',tr)
                                        ">Ver Detalles</vs-button>
                                        <vs-button color="#00B6AA" type="line" class="w-full" @click="
                                            popupActivo = true;
                                            $emit('getExcelx',tr)
                                        ">Generar Excel</vs-button>

                            <vs-button icon-pack="feather" icon="icon-file" color="#b60c00" type="line" class="w-full" @click=" popupActivo = true; $emit('getPDF',tr)">Generar Pdf</vs-button>

                                    <vs-button v-if="tr.or_estado == 1" color="#28C76F" type="line" class="w-full" @click="popupActivo = true;$emit('popup_desactivar_activar_orden',tr)">Finalizar orden</vs-button>
                                    <vs-button v-if="tr.or_estado == 2" color="#FAB818" type="line" class="w-full" @click="
                                            popupActivo = true;
                                            $emit('popup_desactivar_activar_orden',tr)
                                        ">Poner en pendiente orden</vs-button>
    
                                    <vs-button color="#EA5455" type="line" class="w-full" @click="
                                            popupActivo = true;
                                            $emit('getPreguntaEliminar',tr)
                                        ">Eliminar</vs-button>
                                </vs-dropdown-item>
                            </vs-dropdown-menu>
                        </vs-dropdown>
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>
    </div>
    </template>
    
    <script>
    export default {
        data() {
            return {
                selectedActa: {},
            }
        },
        props: {
            Ordentrabajo: {
                type: Array,
                default: function () { return [] }
            }
        }
    }
    </script>
    