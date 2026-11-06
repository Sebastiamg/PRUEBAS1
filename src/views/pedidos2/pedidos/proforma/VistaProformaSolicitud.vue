<template>
    <div>
        <div v-if="setMenu == 0 || setMenu == 1">
            <!--cliente-->
            <vs-row>
                <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" vs-type="flex">
    
                    <vs-row vs-type="flex" vs-justify="center" vs-w="6" style="font-size: 15px;">
                        <vs-col vs-justify="center" vs-align="center" vs-w="10" class="m-2">
                            <span><b>Temporada: </b>{{ proforma.temporada }} </span>
                        </vs-col>
                        <vs-col vs-justify="center" vs-align="center" vs-w="10" class="m-2">
                            <span><b>Cliente: </b>{{ proforma.cliente1 }} <span v-if="!proforma.cliente1"><b style="color: #d9534f;">Seleccione un cliente</b></span></span>
                        </vs-col>
                        <vs-col vs-justify="center" vs-align="center" vs-w="10" class="m-2">
                            <span><b>Fecha: </b>{{ proforma.fecha }} </span>
                        </vs-col>
                        <vs-col vs-justify="center" vs-align="center" vs-w="10" class="m-2">
                            <span><b>IVA: </b>{{ proforma.iva.value }}</span>
                        </vs-col>
                        <vs-col vs-justify="center" vs-align="center" vs-w="10" class="m-2">
                            <span><b>Observación de librería: </b>{{ proforma.libobservacion }}</span>
                        </vs-col>
                        <vs-col vs-justify="center" vs-align="center" vs-w="10">
                            <vs-collapse type="border">
                                <vs-collapse-item  icon-pack="feather" icon-arrow="icon-arrow-down">
                                    <div slot="header" class="w-full">
                                        <i class="fa-solid fa-list"></i> Información de pedidos del <b>GRUPO {{setPuntos.ca_codigo_agrupado}}</b>
                                    </div>
                                    <div class="vx-row" v-if="setPuntos.ca_codigo_agrupado">
                                        <div class="vx-col w-full">
                                            <InformacionVue :idperiodo="setPuntos.id_periodo" :ca_codigo_agrupado="setPuntos.ca_codigo_agrupado" />
                                        </div>
                                    </div>
                                </vs-collapse-item>
                            </vs-collapse>
                        </vs-col>
                    </vs-row>
                    <vs-row vs-type="flex" vs-justify="center" vs-w="6" style="font-size: 12px;">
                        <vs-col vs-justify="center" vs-align="center" vs-w="10" class="m-2">
                            <p>Empresa: *</p>
                            <v-select @input="cleanCliente()" :options="listaEmpresas" :reduce="(listaEmpresas) => listaEmpresas" density="comfortable" label="nombre" class="w-full" value="id" placeholder="--Seleccione--" v-model="proforma.empresa" :disabled="accionProforma==1&&proforma.empresa.id>0" />
                            <span v-if="!proforma.empresa" style="color: red;">Seleccione la empresa.</span>
                        </vs-col>
                        <vs-col vs-justify="center" vs-align="center" vs-w="10" class="m-2">
                            <!--input-->
                            <div>
                                <vs-input label="Escriba el descuento %" v-model="proforma.des" class="w-full" type="number" min="0" max="100" step="1" @blur="validateDescuentoBlur();" @input="validateDescuento();" placeholder="Descuento" />
                            </div>
                        </vs-col>
                        <vs-col vs-justify="center" vs-align="center" vs-w="10" class="mt-2">
                            <vs-textarea label="Observación:" placeholder="Ingrese la observación..." class="w-full" v-model="proforma.observacion" />
                            <span v-if="!proforma.observacion" style="color: red;">Ingrese una observación</span>
                        </vs-col>
                    </vs-row>
                </vs-col>
            </vs-row>
            <vs-row vs-type="flex" vs-justify="center" vs-w="12" style="font-size: 12px;">
                <vs-col vs-justify="center" vs-align="center" vs-w="12" class="m-2" v-if="proforma.empresa">
                    <DatosDespachoVue v-if="accionProforma == 0" ref="clientePerseoRef" :empresa="proforma.empresa" @enviarDatosDespacho="enviarDatosDespacho" :accionProforma="accionProforma" :id_periodo="setPuntos.id_periodo" :ifFirstProforma="Boolean(ifFirstProforma)" />
                    <DatosDespachoVue v-if="accionProforma == 1" ref="clientePerseoRef" :empresa="proforma.empresa" @enviarDatosDespacho="enviarDatosDespacho" :accionProforma="accionProforma" :idProforma="ObjectEdit.prof_id" :id_periodo="setPuntos.id_periodo" :ifFirstProforma="Boolean(ifFirstProforma)" :firstProforma="firstProforma" />
                </vs-col>
            </vs-row>
            <vs-row>
                <div class="card shadow vx-col w-full m-2 pb-3">
                    <vs-divider><b style="font-size: 14px;">PERMISOS</b></vs-divider>
                    <vs-row>
                        <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6" class="mt-3">
                            <vs-col vs-type="flex" vs-justify="start" vs-align="start" vs-lg="12" vs-sm="12" vs-xs="12" class="ml-2 mt-2">
                                <b style="font-size: 13px;">Permitir ingresar más de lo solicitado</b>
                                <vs-switch id="check" style="margin-left: 10px;" v-model="proforma.mas" @input="verificaciones()" icon-pack="feather" vs-icon-on="icon-check" vs-icon-off="icon-x" color="success"></vs-switch>
                            </vs-col>
                            <vs-col vs-type="flex" vs-justify="start" vs-align="start" vs-lg="12" vs-sm="12" vs-xs="12" class="ml-2 mt-2">
                                <div v-if="proforma.mas">
                                    <p class="text-danger" style="font-family:verdana;font-size:12.5px;"><i class="fa-solid fa-exclamation-triangle"></i> Se permitirá <b>ingresar más</b> de lo <b>solicitado</b>.</p>
                                </div>
                                <div  v-else-if="!proforma.mas">
                                    <p class="text-success" style="font-family:verdana;font-size:12.5px;"><i class="fa-solid fa-check"></i> Control de <b>no ingresar más de lo solicitado</b>.</p>
                                </div>
                            </vs-col>
                        </vs-col>
                        <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6" class="mt-3">
                            <vs-col vs-type="flex" vs-justify="start" vs-align="start" vs-lg="12" vs-sm="12" vs-xs="12" class="ml-2 mt-2">
                                <b style="font-size: 13px;">Permitir Proformar con stock mínimo</b>
                                <vs-switch v-model="proforma.activa" id="check" style="margin-left: 10px;" icon-pack="feather" vs-icon-on="icon-check" vs-icon-off="icon-x" color="success"></vs-switch>
                            </vs-col>
                            <vs-col vs-type="flex" vs-justify="start" vs-align="start" vs-lg="12" vs-sm="12" vs-xs="12" class="ml-2 mt-2">
                                <div v-if="proforma.activa">
                                    <p class="text-danger" style="font-family:verdana;font-size:12.5px;"><i class="fa-solid fa-exclamation-triangle"></i>Se permitirá <b>ingresar más</b> del <b>STOCK MÍNIMO</b>.</p>
                                </div>
                                <div v-else-if="!proforma.activa">
                                    <p class="text-success" style="font-family:verdana;font-size:12.5px;"><i class="fa-solid fa-check"></i> Control de <b>no ingresar más del STOCK MÍNIMO</b>.</p>
                                </div>
                            </vs-col>                            
                        </vs-col>
                    </vs-row>
                    <vs-row>
                        <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6" class="mt-3  mb-4">
                            <vs-row>
                                <vs-col v-if="accionProforma == 0" vs-type="flex" vs-justify="start" vs-align="start" vs-lg="12" vs-sm="12" vs-xs="12" class="ml-2 mt-2">
                                    <b style="font-size: 13px;">Permitir llenar con valor predeterminado</b>
                                    <vs-switch v-model="activa" id="check" style="margin-left: 10px;"  @input="valor='';serie=''" icon-pack="feather" vs-icon-on="icon-check" vs-icon-off="icon-x" color="success"></vs-switch>
                                </vs-col>
                                <vs-col v-if="activa" vs-justify="start" vs-align="start" vs-lg="12" vs-sm="12" vs-xs="12" class="ml-2 mt-2">
                                    <div class="w-full mb-2" style="display: flex; justify-content: center">
                                        <div class="w-1/3">
                                            <div>
                                                <p style="font-size: 13px;" class="mr-1 mt-1">Serie: </p>
                                                <v-select :options="series" :reduce="(series) => series" label="nombre_serie" class="w-full bg-white " placeholder="--Seleccione--" v-model="serie" />
                                            </div>
                                        </div>
                                        <div class="w-3/6">
                                            <vs-input label="Valor:"  style="max-height: 30px;"  type="number" placeholder="Secuencial" class="w-full ml-2 mr-2" icon="mode_edit" v-model="valor" @keypress="numerico"/>
                                        </div>
                                        <div class="w-1/4">
                                            <vs-button color="success" @click="getvalor()" style="max-height: 30px; max-width:150px ;" class="w-full ml-4 mt-5" >Rellenar</vs-button>
                                        </div>
                                    </div>
                                    <div v-if="valor">
                                        <vs-alert color="danger" icon-pack="feather" icon="icon-info" class="mt-4">
                                            <span style="font-family:verdana;font-size:12.5px;">Si el <b>valor ingresado</b> es mayor que la cantidad solicitada, el campo quedará <b>vacío</b>.</span>
                                        </vs-alert>
                                    </div>
                                </vs-col>
                            </vs-row>
                        </vs-col>
                        <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6" class="mt-3  mb-4">
                            <vs-col vs-type="flex" vs-justify="start" vs-align="start" vs-lg="12" vs-sm="12" vs-xs="12" class="ml-2 mt-2">
                                <b style="font-size: 13px;">Permitir cargar todos los libros</b>
                                <vs-switch id="check" style="margin-left: 10px;" v-model="proforma.libros" @input="getLibrostodos()" icon-pack="feather" vs-icon-on="icon-check" vs-icon-off="icon-x" color="success"></vs-switch>
                            </vs-col>
                            <vs-col vs-type="flex" vs-justify="start" vs-align="start" vs-lg="12" vs-sm="12" vs-xs="12" class="ml-2 mt-2">
                                <div v-if="proforma.libros">
                                    <p class="text-danger" style="font-family:verdana;font-size:12.5px;"><i class="fa-solid fa-exclamation-triangle"></i> Se cargaron <b>todos los libros</b> sin restricciones.</p>
                                </div>
                                <div v-else-if="!proforma.libros">
                                    <p class="text-success" style="font-family:verdana;font-size:12.5px;"><i class="fa-solid fa-check"></i> Se cargaron <b>todos los libros del GRUPO {{setPuntos.ca_codigo_agrupado}}</b>.</p>
                                </div>
                            </vs-col>
                        </vs-col>
                    </vs-row>
                    <!-- <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" class="ml-2">
                        <vs-col vs-w="7" style="font-size: 12px;">
                            <div class="flex" v-if="accionProforma == 0">
                                <b for="checkbox">Permitir llenar con valor predeterminado</b>
                                <input type="checkbox" style="width:50px;" v-model="activa" id="check" /><br />
                            </div>
                            <div v-if="activa">
                                <div class="flex">
                                    <vs-col vs-justify="center" vs-align="center" vs-w="4" class="m-1">
                                        <p>Serie: </p>
                                        <v-select :options="series" :reduce="(series) => series" density="comfortable" label="nombre_serie" class="w-full" placeholder="--Seleccione--" v-model="serie" />
                                    </vs-col>
                                    <vs-col vs-justify="center" vs-align="center" vs-w="4" class="m-1">
                                        <p>Ingrese el Valor: </p>
                                        <vs-input class="w-full" @keypress="numerico" v-model="valor" density="comfortable" />
                                    </vs-col>
                                    <vs-col vs-justify="center" vs-align="center" vs-w="4" class="m-1">
                                        <br />
                                        <vs-button class="m-2" color="success" @click="getvalor()" style="height: 30px; font-size: 12px;">Rellenar</vs-button>
                                    </vs-col>
                                </div>
                                <div v-if="valor">
                                    <p style="background-color: beige; padding:5px;" v-if="valor">Si el valor ingresado es mayor que la
                                        cantidad solicitada, el campo quedará vacío.</p>
                                </div>
                            </div>
                        </vs-col>
                        <vs-col vs-w="5" style="font-size: 12px;">
                            <div class="flex" style="display: flexbox;">
                                <b for="checkbox">Permitir Proformar con stock mínimo</b>
                                <input type="checkbox" style="width:50px;" v-model="proforma.activa" id="checkbox" />
                            </div>
                            <div v-if="proforma.activa">
                                <p style="background-color: beige; padding:5px; font-size: 12px;" v-if="proforma.activa">Se activo el stock mínimo.</p>
                            </div>
                        </vs-col>
                    </vs-col>
                    <vs-col vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" class="ml-2">
                        <vs-col vs-w="7" style="font-size: 12px;">
                            <p class="flex" style="display: flexbox;">
                                <b for="checkbox">Permitir Prepoformar más de los solicitado</b>
                                <input type="checkbox" style="width:80px;" v-model="proforma.mas" @change="verificaciones()" />
                            </p>
                            <p>
                                <div v-if="proforma.mas">
                                    <p class="text-warning" style="font-family:verdana;font-size:16px;"><i class="fa-solid fa-exclamation-triangle"></i> Se preproformará mas de la cantidad solicitada</p>
                                </div>
                            </p>
                        </vs-col>
                        <vs-col vs-w="5" style="font-size: 12px;" v-if="permitirlibros==1">
                            <p class="flex" style="display: flexbox;">
                                <b for="checkbox" color="danger">Permitir cargar todos los libros</b>
                                <input type="checkbox" style="width:80px;" v-model="proforma.libros" @change="getLibrostodos()" /><br />
                            </p>
                            <p>
                                <div v-if="proforma.libros">
    
                                    <p class="text-danger" style="font-family:verdana;font-size:16px;"><i class="fa-solid fa-exclamation-triangle"></i> Se Cargará todos los libros</p>
    
                                </div>
                            </p>
                        </vs-col>
                    </vs-col> -->
                    <!-- <vs-button v-if="permitirlibros==1" @click="getLibrostodos()" color="danger" type="border">Cargar todos los libros</vs-button> -->
                </div>
            </vs-row>
            <vs-col vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" style="text-align: center">
                <b>Detalle Proforma</b>
                <div v-if="isActiveCupo && setPuntos.ca_tipo_pedido == 2">
                    <p class="text-success" style="font-family:verdana;font-size:18px;"><b><i class="fa-solid fa-money-check-dollar"></i> Cupo: </b>{{ proforma.cupo }}</p>
                    <!--si el valor de proforma excede el cupo un mensaje-->
                    <p v-if="proforma.tot > proforma.cupo" class="text-danger" style="font-family:verdana;font-size:18px;"><b><i class="fa-solid fa-exclamation-triangle"></i> El valor total ${{ proforma.tot}} excede el cupo de {{ proforma.cupo }}</b></p>
                </div>
            </vs-col>
        </div>
        <vs-col vs-justify="center" vs-align="center" vs-w="12" class="m-2" v-if="setMenu == 3">
            <vs-col vs-justify="center" vs-align="center" vs-w="10" class="m-2">
                <vs-textarea label="Observación:" placeholder="Escribe..." class="w-full" v-model="proforma.libreria" />
                <span v-if="!proforma.libreria" style="color: red; font-size: 11.5px;">Este campo es obligatorio</span>
            </vs-col>
        </vs-col>
        <vs-row>
    
        </vs-row>
        <!-- <vs-row v-if="accionProforma == 1 && producto.length > 0 && !proforma.libros">
            <vs-col vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" style="text-align: center"><b>Añadir
                    Ítem.</b></vs-col>
            <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="8" vs-sm="9" class="m-2">
                        <v-select :options="producto" :reduce="producto => producto" density="comfortable" label="nombrelibro" class="w-full" v-model="prod" placeholder="--Seleccione--" required />
                    </vs-col>
                    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="1" vs-sm="1" class="m-2">
                        <vs-button color="success" type="relief" icon="add" @click="add()">Añadir</vs-button>
                    </vs-col>
                </vs-row>
            </vs-col>
        </vs-row> -->
        <vs-row v-if="(arregloLibros.length>0 && proforma.libros) || setMenu==3">
            <vs-col vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" style="text-align: center"><b>Añadir
                    Ítem.</b></vs-col>
            <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="8" vs-sm="9" class="m-2">
                        <v-select :options="arregloLibros" :reduce="arregloLibros => arregloLibros" label="nombrelibro" class="w-full h-100" placeholder="--Seleccione--" v-model="prod" />
                    </vs-col>
                    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="1" vs-sm="1" class="m-2">
                        <vs-button color="success" type="relief" icon="add" @click="add()">Añadir</vs-button>
                    </vs-col>
                </vs-row>
            </vs-col>
        </vs-row>
        <vs-row>
            <vs-col vs-lg="12" vs-sm="12" vs-xs="12">
                <vs-divider>Cantidad: {{ inputs.length }}</vs-divider>
                <vs-table class="table users table-hover" search :data="inputs" :max-items="inputs.length">
                    <template slot="thead" v-if="setMenu == 3">
                        <vs-th width="50"> # </vs-th>
                        <vs-th width="400"> Detalle del producto </vs-th>
                        <vs-th width="200"> Cantidad pedido solicitado</vs-th>
                        <vs-th width="200"> Cantidad recibida</vs-th>
                        <vs-th width="200"> Cantidad a solicitar</vs-th>
                        <vs-th width="200"> Valor Unitario</vs-th>
                        <vs-th width="50" v-if="accionProforma == 1 && inputs.length > 1"></vs-th>
                    </template>
                    <template slot="thead" v-else>
                        <vs-th width="50"> # </vs-th>
                        <vs-th width="400"> Detalle del producto </vs-th>
                        <vs-th width="150"> Stock</vs-th>
                        <vs-th width="200"> Cantidad solicitado</vs-th>
                        <vs-th width="200"> Cantidad Vendida</vs-th>
                        <vs-th width="200"> Cantidad autorizada</vs-th>
                        <vs-th width="200"> Valor Unitario</vs-th>
                        <vs-th width="100" v-if="setMenu != 3"> Subtotal</vs-th>
                        <vs-th width="50" v-if="accionProforma == 1 && inputs.length > 1"></vs-th>
                    </template>
                    <template slot-scope="{ data }">
                        <vs-tr v-for="(inputvs, k) in data" :key="k">
                            <vs-td><br /><b>{{ k + 1 }}</b></vs-td>
                            <vs-td v-if="accionProforma == 0">{{ inputvs.codigo_liquidacion }} {{ inputvs.nombrelibro
                                        }}<br /><span v-if="inputvs.id_serie == 19"><b>Descripción combo:</b><br>
                                    {{ inputvs.id_serie == 19 ?  inputvs.descripcion : '' }}</span>
                                <div v-if="proforma.activa">
                                    <vs-alert color="danger" icon="new_releases" v-if="inputvs.cantidad > inputvs.stock"> Stock insuficiente. Este artículo no se
                                        agregará debido a la falta de existencias.
                                    </vs-alert>
                                </div>
                                <div v-else>
                                    <b v-if="inputvs.cantidad >= (inputvs.stock - stock)&& setMenu!=3">
                                        <vs-alert color="warning" icon="sms">Stock insuficiente. Este artículo no se puede agregar debido a la falta de existencias. <br />
                                            Para registrar este artículo, asegúrate de activar el Stock Mínimo.
                                        </vs-alert>
                                    </b>
                                    <vs-alert color="warning" icon="sms" v-else-if="setMenu==3&&inputvs.cantidad > (inputvs.stock - stock)">Este artículo no se puede agregar debido a la falta de existencias.</vs-alert>
                                    <vs-alert color="danger" icon="new_releases" v-else-if="inputvs.cantidad >= inputvs.stock &&setMenu==3"> Stock insuficiente. Este artículo no se
                                        agregará debido a la falta de existencias.
                                    </vs-alert>
                                </div>
                            </vs-td>
                            <vs-td v-else>{{ inputvs.pro_codigo }} {{ inputvs.nombre }}<br /><span v-if="inputvs.id_serie == 19"><b>Descripción combo:</b><br>
                                    {{ inputvs.id_serie == 19 ?  inputvs.descripcion : '' }}</span>
                                <div v-if="proforma.activa">
                                    <vs-alert color="danger" icon="new_releases" v-if="(inputvs.cantidad-inputvs.det_prof_cantidad) > inputvs.stock"> Stock
                                        insuficiente. Este artículo no se agregará debido a la falta de
                                        existencias.
                                    </vs-alert>
                                </div>
                                <div v-else>
                                    <b v-if="(inputvs.cantidad-inputvs.det_prof_cantidad) >= (inputvs.stock - stock)&&setMenu!=3">
                                        <vs-alert color="warning" icon="sms">Stock insuficiente. Este artículo no se puede agregar debido a la falta de
                                            existencias. <br /> Para registrar este artículo, asegúrate de activar el Stock
                                            Mínimo.</vs-alert>
                                    </b>
                                    <vs-alert color="warning" icon="sms" v-else-if="setMenu==3 &&(inputvs.cantidad-inputvs.det_prof_cantidad) >= (inputvs.stock - stock)">Este artículo no se puede agregar debido a la falta de existencias.</vs-alert>
                                    <vs-alert color="danger" icon="new_releases" v-else-if="(inputvs.cantidad-inputvs.det_prof_cantidad) >= inputvs.stock &&setMenu==3"> Stock insuficiente. Este artículo no se
                                        agregará debido a la falta de existencias.
                                    </vs-alert>
    
                                </div>
                            </vs-td>
                            <vs-td v-if="setMenu != 3">{{ inputvs.stock }}</vs-td>
                            <vs-td v-if="accionProforma == 0">{{ inputvs.valor }}</vs-td>
                            <vs-td v-else>{{ inputvs.valor }}</vs-td>
                            <vs-td>{{ inputvs.despacho }}</vs-td>
                            <vs-td>
                                <!-- stock {{ inputvs.stock }}
                                      valor {{ inputvs.valor }}
                                      despacho {{ inputvs.despacho }}-->
                                <!-- autorizada {{ inputvs.cantidad }} -->
    
                                <vs-input class="w-full m-2" v-model="inputvs.cantidad" :min="0" :step="1" :max="inputvs.valor - inputvs.despacho" type="text" @keypress="handleKeyPress($event, inputvs);verificar($event, inputvs)" @paste="handlePaste($event, inputvs);verificar($event, inputvs);" :ref="'inputvs_' + k" style="font-size: small;" @blur="calculos" />
                            </vs-td>
                            <vs-td v-if="accionProforma == 0">{{ inputvs.precio }}</vs-td>
                            <vs-td v-else>{{ inputvs.det_prof_valor_u }}</vs-td>
                            <vs-td v-if="setMenu != 3">{{ inputvs.subtotal.toFixed(2) }}</vs-td>
                            <vs-td v-if="accionProforma == 1 && inputs.length > 1">
                                <vs-button v-if="k > -1" @click="getremove(k, inputvs)" color="danger" type="relief" icon="delete">Quitar</vs-button>
                            </vs-td>
    
                        </vs-tr>
                    </template>
                </vs-table>
                <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" vs-type="flex" v-if="setMenu != 3">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="9">
                        <vs-col vs-justify="center" vs-align="center" vs-w="10" class="m-2">
                        </vs-col>
                    </vs-row>
                    <vs-row vs-type="flex" vs-w="3">
                        <vs-col vs-justify="center" vs-w="10" class="m-2">
                            <table>
                                <tr>
                                    <td colspan="6"></td>
                                    <td>
                                        <b style="color: blueviolet;"></b>
                                    </td>
                                    <td colspan="3"> <b style="color: blue;">Subtotal $:</b></td>
                                    <td style="text-align: right;">
                                        <b>{{ proforma.subt }}</b>
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="6"></td>
                                    <td></td>
                                    <td colspan="3"> <b style="color: blue;">Descuento {{ proforma.des }} $:</b>
                                    </td>
                                    <td style="text-align: right;">
                                        <b>{{ proforma.desco}}</b>
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="7"> </td>
                                    <td colspan="3"> <b style="color: blue;">Subtotal - Descuento $:</b></td>
                                    <td style="text-align: right;">
                                        <b>{{ proforma.subtotal }}</b>
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="7"> </td>
                                    <td colspan="3"> <b style="color: blue;">IVA $:</b></td>
                                    <td style="text-align: right;">
                                        <b>{{ proforma.iv}}</b>
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="7"> </td>
                                    <td colspan="3"> <b style="color: blue;">Transporte $:</b></td>
                                    <td style="text-align: right;">
                                        <b>{{ proforma.transp }}</b>
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="7"> </td>
                                    <td colspan="3"> <b style="color: blueviolet;">TOTAL $:</b></td>
                                    <td style="text-align: right;">
                                        <b style="color: blueviolet;">{{ proforma.tot }}</b>
                                    </td>
                                </tr>
                            </table>
                        </vs-col>
                    </vs-row>
                </vs-col>
            </vs-col>
        </vs-row>
        <br /><br />
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="mt-2">
            <vs-button v-if="accionProforma == 0" @click="guardarnuevo1();" type="relief" color="green"><small v-if="setMenu == 3">Enviar</small><small v-else>Guardar</small></vs-button>&emsp;
            <vs-button v-if="accionProforma == 1" @click="conta=0;editar();" type="relief" color="green"><small v-if="setMenu == 3">Actualizar</small><small v-else>Editar</small></vs-button>&emsp;
            <vs-button @click="cerrar();" color="danger" type="relief">Cancelar</vs-button>
        </vs-col>
        <vs-popup v-if="popupeliminar" title="Eliminación" :active.sync="popupeliminar" class="popophijo">
            <vs-row>
                <vs-col vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" style="text-align: center;">
                    <b style="font-size: 15px">Confirmar Eliminación {{ cod_pro  }} - {{ nombre }}</b>
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <div>
                            <b>¿Estás seguro que deseas eliminar el item {{ nombre }}?</b>
                        </div>
                    </vs-row>
                    <br><br>
                    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="mt-2">
                        <vs-button @click="remove(indexToRemove)" color="danger" type="relief" class="mr-4">Aceptar</vs-button>
                        <vs-button @click="popupeliminar = false" color="success" type="relief">Cancelar</vs-button>
                    </vs-col>
                </vs-col>
            </vs-row>
        </vs-popup>
    </div>
    </template>
    
    <script>
    import vSelect from 'vue-select';
    const DatosDespachoVue = () => import('./components/DatosDespacho.vue')
    const InformacionVue = () => import('./components/informacionpedido.vue')
    import ProformaRepository from '../../../../repositories/ProformaRepository';
    export default {
        components: {
            vSelect,
            DatosDespachoVue,
            InformacionVue,
        },
        data() {
            return {
                indexToRemove: null,
                popupeliminar: false,
                nombre: null,
                serie: '',
                series: '',
                id: '',
                activa: '',
                valor: '',
                idusuarioresp: '',
                tipo: '',
                codigo: '',
                cod_pro: '',
                cant: '',
                prod: '',
                conta: 0,
                stock: 0,
                conta: 0,
                proforma: {
                    id: "",
                    codigo: '',
                    temporada: "",
                    empresa: "",
                    fecha: "",
                    cliente: "",
                    cliente1: "",
                    observacion: "",
                    libreria: '',
                    libros: '',
                    libobservacion: '',
                    activa: '',
                    tipo: '',
                    tipos: "",
                    estado: "",
                    des: "",
                    dec: "",
                    iva: "",
                    user: '',
                    descuento: '',
                    transporte: '',
                    total: "",
                    subt: '',
                    tot: '',
                    descu: '',
                    subtotal: '',
                    iv: '',
                    tot: '',
                    transp: '',
                    desco: '',
                    cupo: 0,
                    mas: false,
                },
                pro: [],
                inputs: [],
                producto: [],
                ventas: [],
                nombre_periodo: '',
                arregloLibros: '',
                setMenu: '',
                permiso: 0,
                arreglo: [],
                descuento: '',
                iva: '',
                descuentoEscuela: '',
                datosDespachoSelect: {
                    nombreInstitucion: '',
                    ciudad: '',
                    id_institucion: '',
                    idusuario: '',
                    nombre: '',
                    cedula: '',
                    datosInstitucion: [],
                    clientesidPerseo: 0,
                },
                usuario: [],
                ObjectAgrupado: '',
                isActiveCupo: false,
                firstProforma: '',
                ifFirstProforma: false,
                permitirlibros: '',
                mixinIdInicioFormatoNewData: null,
            };
        },
        mounted() {
            let me = this
            // Verifica si los datos existen en localStorage
            const mixinData = localStorage.getItem('mixin_IdInicioFormatoNew');
            if (mixinData) {
                // Convierte el JSON en un array de objetos y extrae solo 'minimo' si existe
                const parsedData = JSON.parse(mixinData);
                me.mixinIdInicioFormatoNewData = parsedData.length > 0 ? parsedData[0].minimo : null;
                console.log("Valor de minimo:", me.mixinIdInicioFormatoNewData); // Verifica el valor en consola
            } else {
                console.warn("No se encontraron datos en localStorage para mixin_IdInicioFormatoNew");
            }
            // FIN Verificación si los datos existen en localStorage
            me.ifFirstProforma = false
            this.usuario = JSON.parse(localStorage.getItem('usuario'));
            console.log('hdsjdhjkashdjshajkdgsajdhsajhdjksahjkdshdjhsjdhsajkh',me.inputs2);
            // this.setMenu = localStorage.getItem('setMenu');
            this.nombre_periodo = localStorage.getItem('nombre_periodoPuntos');
            const usuariorespo = localStorage.getItem("usuario");
            const usuarioObjeto = JSON.parse(usuariorespo);
            this.idusuarioresp = usuarioObjeto.idusuario;
            this.setMenu = 3
            this.proforma.mas =true;
            this.verificaciones();
            this.getmin();
            this.permitirlibros = 1;
            setTimeout(function () {
                if (me.accionProforma == 0) {
                    me.start()
                    me.seriesUnicas();
                }
                if (me.accionProforma == 1) {
                    me.datosfirstProforma()
                }
            }, 1000);
        },
        props: {
            listaEmpresas: {
               type: Array,
               default: () => []
            },
            options: {
               type: Array,
               default: () => []
            },
            option: {
                type: Array,
                default: () => []
            },
            inputs2: {
                type: Array,
                default: () => []
            },
            input: {
                type: Array,
                default: () => []
            },
            editan: {
                type: Array,
                default: () => []
            },
            sendPedido: {
                type: [Object, String],
                default: () => {}
            },
            setPuntos: {
                type: [Object, String],
                default: () => {}
            },
            accionProforma: {
                type: Number,
                default: 0
            },
            id1: {
                type: String,
                default: ''
            },
            idperiodo: {
                type: Number,
                default: 0
            },
            tip: {
                type: Number,
                default: 0
            },
            ObjectEdit: {
                type: Object,
                default: () => {}
            },
        },
        watch: {
            listaEmpresas(results) {
                this.listaEmpresas = results
            },
            options(results) {
                this.options = results
            },
            option(results) {
                this.option = results
            },
        },
        computed: {
            maximoPermitido(inputvs) {
                // Calcula el valor máximo permitido según this.proforma.activa
                if (this.proforma.activa) {
                    return this.inputvs.valor - this.inputvs.despacho; // máximo cuando activa es true
                } else {
                    return this.inputvs.otro_valor_maximo; // máximo cuando activa es false
                }
            }
        },
        methods: {
            cleanCliente() {
                let me = this
                setTimeout(e => {
                    me.limpiarCliente()
                }, 1000)
    
            },
            limpiarCliente() {
                let me = this
                me.$refs.clientePerseoRef.f_quitarCliente()
            },
            loadInformacionGrupo() {
                let me = this
                let datos = me.setPuntos.ca_codigo_agrupado? me.setPuntos.ca_codigo_agrupado: me.id1
                ProformaRepository.InformacionAgrupado(datos).then(r => {
                    me.ObjectAgrupado = r.data[0]
                    if (me.ObjectAgrupado.pedidos) {
                        //si tiene un solo elemento en pedidos proforma.des seria igual a el descuento
                        if (me.ObjectAgrupado.pedidos.length == 1) {
                            me.proforma.des = me.ObjectAgrupado.pedidos[0].descuento
                        }
                    }
                    //primera proforma
                    if (me.ObjectAgrupado.proformas) {
                        me.firstProforma = me.ObjectAgrupado.proformas[0]
                    }
                    //si es la primera proforma se aplica el cupo
                    if (me.ObjectAgrupado.proformas.length == 0) {
                        me.isActiveCupo = true
                    } else {
                        //si hay proformas verifico que el id es igual al ObjectEdit.id
                        me.ObjectAgrupado.proformas.forEach(element => {
                            if (element.id == me.ObjectEdit.id) {
                                me.isActiveCupo = true
                            }
                        });
                    }
                })
            },
            validateDescuento() {
                //validar no numeros negativos ni mayor a 100
                if (this.proforma.des < 0) {
                    this.proforma.des = 0;
                }
                if (this.proforma.des > 100) {
                    this.proforma.des = 100;
                }
    
                this.calculos();
            },
            validateDescuentoBlur() {
                //si es vacio o nulo se asigna 0
                if (this.proforma.des == '') {
                    this.proforma.des = 0;
                }
                this.calculos();
            },
            seriesUnicas() {
                this.series = [...new Set(this.inputs.map(item => item.nombre_serie))];
            },
            enviarDatosDespacho(e) {
                let me = this
                console.log("cliente", e)
                me.datosDespachoSelect = e;
                me.proforma.cliente1 = me.datosDespachoSelect.nombre;
                if (me.datosDespachoSelect.datosInstitucion.length > 0) {
                    me.proforma.des = me.datosDespachoSelect.datosInstitucion[0].ffp_descuento
                    me.proforma.cupo = me.datosDespachoSelect.datosInstitucion[0].ffp_cupo
                } else {
                    if (me.setPuntos.ca_tipo_pedido == 2) {
                        me.proforma.des = 0
                    }
                    me.proforma.cupo = 0
                }
                me.calculos();
            },
            getvalor() {
                if (!this.valor || isNaN(this.valor)) {
                    this.$vs.notify({
                        text: "Ingrese un valor númerico",
                        color: "danger",
                        iconPack: "feather",
                        icon: "icon-alert-triangle",
                    });
                    return;
                }
                this.inputs.forEach(p => {
                    if (p.nombre_serie == this.serie) {
                        p.cantidad = ((p.valor - p.despacho) >= this.valor) ? this.valor : '';
                        if (this.proforma.activa == true) {
                            if (p.cantidad !== '' && p.cantidad > p.stock) {
                                if (p.stock >= 0) {
                                    p.cantidad = p.stock; // Establecer cantidad igual al stock disponible
                                } else {
                                    p.cantidad = ''; // Establecer cantidad igual a 0
                                }
                            }
    
                        } else {
                            if (p.cantidad !== '' && p.cantidad > (p.stock - this.stock)) {
                                p.cantidad = ''; // Establecer cantidad igual al stock disponible
                            }
                        }
                    }
                });
                this.calculos();
                this.valor = '';
                this.serie = '';
            },
    
            getpro() {
                let me = this;
                const usuariorespo = localStorage.getItem("usuario");
                const usuarioObjeto = JSON.parse(usuariorespo);
                let iniusuario = usuarioObjeto.iniciales
                me.idusuarioresp = usuarioObjeto.idusuario;
                me.user = usuarioObjeto.nombres + " " + usuarioObjeto.apellidos;
                let c, d;
                if (me.proforma.empresa == null || me.proforma.empresa == "" || me.proforma.empresa == undefined) {
                    me.$vs.notify({
                        text: "Seleccione",
                        color: "warning",
                        iconPack: "feather",
                        icon: "icon-check",
                    });
                    return;
                } else {
                    if (me.setMenu == 3) {
                        me.proforma.empresa.id = '';
                    }
                    console.log(me.proforma.empresa);
                    this.$http
                        .get(this.$server_url + "Get_Cod_Pro?id=" + me.proforma.empresa.id)
                        .then((response) => {
                            const ne = response.data;
                            c = ne[0];
                            d = ne[1];
                            me.id = c + "-" + iniusuario + "-" + d;
                            me.proforma.id = c + "-" + iniusuario + "-" + d;
                        })
                        .catch((error) => {
                            console.error(error);
                        });
                }
                console.log(me.proforma.id);
            },
            numerico(event) {
                if (!/\d/.test(event.key)) {
                    event.preventDefault();
                    return;
                }
            },
            cerrar() {
                let me = this;
                me.$emit("change", true);
            },
            async getmin() {
                //reservar
                let a = '1';
                await this.$http.get(this.$server_url + 'Get_MinStock?nombre=' + a)
                    .then(res => {
                        this.stock = res.data;
                        this.getactivarmin();
                    })
                    .catch(err => {
                        console.log(err)
                    });
            },
    
            setDescuento() {
                this.descuentoEscuela = {
                    id: this.sendPedido.descuento / 100,
                    value: this.sendPedido.descuento + "%"
                }
            },
            getactivarmin() {
                this.inputs.forEach(el => {
                    if (el.stock < this.stock) {
                        this.conta = this.conta + 1;
                    }
                });
            },
            start() {
                let me = this
                this.proforma.observacion = '';
                this.proforma.iva = {
                    id: 0,
                    value: '0%'
                };
                //punto de venta
                if (this.setMenu == 1) {
                    this.proforma.des = 0;
                    this.proforma.dec = {
                        id: 0,
                        value: '0%'
                    };
                    this.proforma.tipo = 1;
                    this.proforma.temporada = this.nombre_periodo;
                    this.proforma.fecha = this.mostrarFechayhora();
                    // this.proforma.cliente1 = this.setPuntos.nombreDespacho;
                    this.proforma.id = this.id;
                    this.inputs = this.input;
                    me.loadInformacionGrupo()
                }
                if (this.setMenu == 3) {
                    this.proforma.libreria = '';
                    this.datosDespachoSelect.id_institucion = this.usuario.institucion_idInstitucion;
                    if (this.tip == 0) {
                        let n = this.descuento / 100;
                        this.proforma.des = {
                            id: n,
                            value: this.sendPedido.descuento + '%'
                        };
                        this.proforma.dec = this.descuento;
                        this.proforma.fecha = this.mostrarFechayhora();
                        this.proforma.id = this.id;
                        this.inputs = this.input;
                    }
                    if (this.tip == 1) {
                        this.proforma.des = {
                            id: 0,
                            value: '0%'
                        };
                        this.proforma.dec = 0;
                        this.proforma.id = this.id;
                        this.inputs = this.input;
                    }
                    this.inputs = this.input;
                    this.getLibrostodos(me.inputs,0);
                }
                this.tipo = 0;
                this.calculos();
            },
            datosfirstProforma() {
                let me = this
                me.loadInformacionGrupo()
                //DESPUES DE 1 SEGUNDO EJECUTAR
                setTimeout(() => {
                    if (me.ObjectEdit.prof_tipo_proforma == 0 && me.ObjectEdit.emp_id == null) {
                        me.ifFirstProforma = true
                        me.staredit()
                    } else {
                        me.ifFirstProforma = false
                        me.staredit()
                    }
                }, 1000)
            },
            //enviar a consultar los libros
            getLibrostodos(datos,tipo) {
                let me = this;
                if (this.proforma.libros|| this.setMenu==3) {
                    me.arregloLibros = '';
                    let datos = me.setPuntos.id_periodo?me.setPuntos.id_periodo:me.idperiodo
                    this.$vs.loading();
                    let nuevarutaxperiodo = '';
                    if (datos <= me.mixinIdInicioFormatoNewData) {
                        nuevarutaxperiodo = 'get_val_pedidoLibrosObsequiosInfoTodoSinPedido?periodo=';
                    }else if (datos > me.mixinIdInicioFormatoNewData) {
                        nuevarutaxperiodo = 'get_val_pedidoLibrosObsequiosInfoTodoSinPedido_new?periodo=';
                    }
                    this.$http.get(this.$server_url + nuevarutaxperiodo + datos)
                        .then(res => {
                            const datos = res.data;
                            this.arregloLibros = datos.map(libro => ({
                                id: libro.id,
                                nombrelibro: libro.nombrelibro,
                                precio: libro.precio,
                                serieArea: libro.serieArea,
                                stock: libro.pro_reservar,
                                valor: libro.pro_reservar,
                                codigo: libro.codigo_liquidacion,
                                serie: libro.id_serie,
                            }));
                            console.log(me.inputs, 'hola', me.arregloLibros);
                            if(tipo == 0){
                                const codigosAEliminar = this.inputs.map(input => input.codigo_liquidacion);
    
                                // Filtramos arregloLibros para eliminar los que tienen un código en codigosAEliminar
                                this.arregloLibros = this.arregloLibros.filter(libro => 
                                !codigosAEliminar.includes(libro.codigo)
                                );
                            }else if(tipo==1){
                                const codigosAEliminar = this.inputs.map(input => input.pro_codigo);
    
                                // Filtramos arregloLibros para eliminar los que tienen un código en codigosAEliminar
                                this.arregloLibros = this.arregloLibros.filter(libro => 
                                !codigosAEliminar.includes(libro.codigo)
                                );
                            }
                           
                            // if (this.arregloLibros.length >= 0 && this.inputs.length >= 0) {
                            //     let productToRemove = []; // Almacena los índices de los elementos a eliminar de this.arregloLibros
    
                            //     this.arregloLibros.forEach((input, i) => {
                            //         let shouldRemoveInpu = false; // Variable para verificar si se debe eliminar el input
                            //         this.inputs.forEach((venta, j) => {
                            //             if (input.codigo === venta.codigo_liquidacion) {
                            //                 shouldRemoveInpu = true; // No se debe eliminar el input
                            //             }
                            //         });
                            //         if (shouldRemoveInpu) {
                            //             productToRemove.push(i); // Agrega el índice del input a eliminar
                            //         }
                            //     });
                            //     // Elimina los elementos de los arrays this.producto y this.ventas
                            //     productToRemove.reverse().forEach(index => {
                            //         this.arregloLibros.splice(index, 1);
                            //     });
                            // }
    
                            // Si this.ventas está vacío pero this.producto tiene elementos
                            if (this.arregloLibros.length !== 0 && this.ventas.length === 0) {
                                // Itera sobre los elementos de this.producto
                                this.arregloLibros.forEach(input => {
                                    // Establece despacho en 0
                                    input.despacho = 0;
                                });
                            }
                            this.venta(this.setMenu);
                            // if (this.arregloLibros.length !== 0 && this.ventas.length !== 0) {
                            //     let productoToRemove = []; // Almacena los índices de los elementos a eliminar de this.producto
                            //     let ventasToRemove = []; // Almacena los índices de los elementos a eliminar de this.ventas
                            //     this.arregloLibros.forEach((input, i) => {
                            //         input.despacho = 0;
                            //         let shouldRemoveInput = false; // Variable para verificar si se debe eliminar el input
                            //         // this.ventas.forEach((venta, j) => {
                            //         //     if (input.codigo === venta.pro_codigo) {
                            //         //         if (input.valor > venta.cantidad) {
                            //         //             input.despacho = venta.cantidad;
                            //         //         } else if (input.valor == venta.cantidad) {
                            //         //             shouldRemoveInput = true; // No se debe eliminar el input
                            //         //             ventasToRemove.push(j); // Agrega el índice de la venta a eliminar
                            //         //         } else {
                            //         //             shouldRemoveInput = true; // No se debe eliminar el input
                            //         //             ventasToRemove.push(j); // Agrega el índice de la venta a eliminar
                            //         //         }
                            //         //     }
                            //         // });
                            //         if (shouldRemoveInput) {
                            //             productoToRemove.push(i); // Agrega el índice del input a eliminar
                            //         }
                            //     });
    
                            //     // Elimina los elementos de los arrays this.producto y this.ventas
                            //     productoToRemove.reverse().forEach(index => {
                            //         this.arregloLibros.splice(index, 1);
                            //     });
    
                            //     ventasToRemove.reverse().forEach(index => {
                            //         this.ventas.splice(index, 1);
                            //     });
                            // }
                            console.log(me.inputs.length, 'hola v', me.arregloLibros.length);
                            this.$vs.loading.close();
                        })
                        .catch(error => {
                            console.error('Error al obtener libros:', error);
                            this.$vs.loading.close();
                        });
                } else {
                    me.arregloLibros = '';
                    me.getadd();
                }
            },
            staredit() {
                let me = this;
                me.inputs = this.inputs2;
                console.log("holaaaa",me.inputs);
                me.inputs.forEach(el => {
                    el.stock = el.pro_reservar;
                    if (!el.valor) {
                        el.valor = el.stock;
                    }
                    if (!el.despacho) {
                        el.despacho = 0;
                    }
                    if ((el.valor - el.despacho) < el.cantidad) {
                        me.proforma.mas = true;
                    }
                });
                me.inputs.forEach(el => {
                    if (parseInt(el.cantidad - el.det_prof_cantidad) > parseInt(el.stock - me.stock)) {
                        me.proforma.activa = true;
                    }
                    if (el.stock < this.stock) {
                        this.conta = this.conta + 1;
                    }
                });
                this.getLibrostodos(me.inputs,1);
    
                let tr = me.ObjectEdit;
                let a = tr.pro_des_por / 100;
                let b = tr.prof_iva_por / 100;
                me.proforma.codigo = tr.id;
                me.proforma.id = tr.prof_id;
                me.proforma.empresa = {
                    id: tr.emp_id,
                    nombre: tr.nombre
                };
                me.proforma.dec = {
                    id: a,
                    value: tr.pro_des_por + "%"
                };
                //si es libreria y no tiene empresa
                // if(me.ifFirstProforma){
                //   me.proforma.des = me.firstProforma.pro_des_por
                // }else{
    
                // }
                me.proforma.des = tr.pro_des_por;
                me.proforma.iva = {
                    id: b,
                    value: tr.prof_iva_por + "%"
                };
                me.proforma.subt = 0;
                me.getadd();
                me.proforma.fecha = me.mostrarFechayhora();
                if (me.setMenu == 3) {
                    console.log(tr);
                    me.descuento = tr.pro_des_por;
                    me.iva = tr.prof_iva_por;
                    me.proforma.libreria = tr.prof_observacion_libreria;
                    me.me.datosDespachoSelect.id_institucion = me.usuario.institucion_idInstitucion;
                } else {
                    me.proforma.observacion = tr.prof_observacion;
                    me.proforma.libobservacion = tr.prof_observacion_libreria;
                }
                if (this.setMenu == 0) {
                    // me.proforma.cliente1 = me.sendPedido.nombreInstitucion;
                    me.proforma.tipo = me.sendPedido.tipo_venta;
                    me.proforma.temporada = me.sendPedido.periodo;
                }
                if (this.setMenu == 1) {
                    // me.proforma.cliente1 = me.setPuntos.nombreDespacho;
                    me.proforma.tipo = 1;
                    me.proforma.temporada = me.nombre_periodo;
                }
                me.calculos();
                
            },
            getdescuento() {
                let me = this
                me.arreglo = []
                this.$http.get(this.$server_url + 'get_beneficiarios_pedidos/' + me.id1)
                    .then(res => {
                        me.arreglo = res.data
                        if (me.arreglo) {
                            me.descuento = me.arreglo[0].comision;
                        }
                    })
            },
            calculos() {
                let me = this;
                if (this.proforma.des == null || this.proforma.des == "null") {
                    this.proforma.des = 0
                }
                this.inputs.forEach(p => {
                    if (me.accionProforma == 0) {
                        p.subtotal = p.cantidad * p.precio
                    }
                    if (me.accionProforma == 1) {
                        p.subtotal = p.cantidad * p.det_prof_valor_u
                    }
                });
                this.proforma.subt = this.inputs.reduce((prev, curr) => prev + parseFloat(curr.subtotal), 0).toFixed(2);
                this.proforma.desco = (parseFloat(this.proforma.subt) * (parseFloat(this.proforma.des)) / 100).toFixed(2);
                this.proforma.subtotal = (this.proforma.subt - this.proforma.desco).toFixed(2);
                this.proforma.iv = (this.proforma.subtotal * this.proforma.iva.id).toFixed(2);
                this.proforma.transp = (0).toFixed(2);
                this.proforma.tot = (parseFloat(this.proforma.subt) - parseFloat(this.proforma.desco) + parseFloat(this.proforma.transp) + parseFloat(this.proforma.iv)).toFixed(2);
                //convertir proforma.tot en float
                this.proforma.tot = parseFloat(this.proforma.tot)
                //si esta activado el cupo
                if (this.isActiveCupo && this.setPuntos.ca_tipo_pedido == 2) {
                    if (this.proforma.tot > this.proforma.cupo && this.setPuntos.ca_tipo_pedido == 2) {
                        //notificacion que el total es mayor al cupo
                        this.$vs.notify({
                            text: "El total de la proforma es mayor al cupo",
                            color: "danger",
                            iconPack: "feather",
                            icon: "icon-alert-triangle",
                        });
                    }
                }
            },
            getremove(index, b) {
                this.codigo = b.det_prof_id;
                this.cod_pro = b.pro_codigo;
                this.cant = b.det_prof_cantidad;
                this.nombre = b.nombre;
                this.indexToRemove = index;
                this.popupeliminar = true; 
                // if (confirm(`Estas seguro de eliminar el ítem ${b.pro_codigo} - ${b.nombre}. `)) {
                //     this.remove(index)
                // }
            },
            remove(index) {
                let me = this;
                let preId = 0;
                let datos = {
                    det_prof_id: me.codigo,
                    pro_codigo: me.cod_pro,
                    det_prof_cantidad: me.cant,
                };
                me.conta = 0;
                if (me.codigo == "" || me.codigo == null || me.codigo == undefined) {
                    preId = this.inputs[index].id;
                    if (preId > 0) {
                        let formData = new FormData();
                        formData.append("id", preId);
                        this.inputs.splice(index, 1);
                    } else {
                        this.inputs.splice(index, 1);
                    }
                    this.popupeliminar = false;
                    me.getadd();
                    me.getLibrostodos();
                } else {
                    me.$vs.loading();
                    this.$http
                        .post(this.$server_url + "Eliminar_DetaProforma", datos)
                        .then((res) => {
    
                            me.$vs.loading.close();
                            if (res.status === 200) {
                                preId = this.inputs[index].id;
                                if (preId > 0) {
                                    let formData = new FormData();
                                    formData.append("id", preId);
                                    this.inputs.splice(index, 1);
                                } else {
                                    this.inputs.splice(index, 1);
                                }
                                me.conta = 1;
                                me.calculos();
                                me.editar();
                                me.getadd();
                                this.popupeliminar = false;
                                me.$vs.notify({
                                    text: res.data.message,
                                    color: 'success',
                                    iconPack: 'feather',
                                    icon: 'icon-check'
                                });
                            }
                            if (res.status === 500) {
                                me.$vs.notify({
                                    text: res.data.message,
                                    color: 'danger',
                                    iconPack: 'feather',
                                    icon: 'icon-check'
                                });
                            }
                            this.popupeliminar = false;
                        })
                        .catch(function (error) {
                            me.$vs.loading.close();
                            me.$vs.notify({
                                text: "Detalle proforma no se pudo eliminar",
                                color: "danger",
                                iconPack: "feather",
                                icon: "icon-x",
                            });
                        });
                }
            },
            async venta(tipo) {
                let buscar = '';
                let busq;
                if (tipo == 0) {
                    buscar = this.sendPedido.id_pedido;
                    busq = tipo;
                }
                if (tipo == 1) {
                    buscar = this.setPuntos.ca_codigo_agrupado;
                    busq = tipo;
                }
                if (tipo == 3) {
                    if (this.setMenu == 3) {
                        if (this.tip == 0) {
                            buscar = this.id1;
                            busq = this.tip;
                        }
                        if (this.tip == 1) {
                            buscar = this.id1;
                            busq = this.tip;
                        }
                    }
                }
                await this.$http
                    .get(this.$server_url + "GetVentas?pedido_id=" + buscar + "&tipo=" + busq)
                    .then((res) => {
                        this.ventas = res.data;
                        this.$vs.loading.close();
                    })
                    .catch((err) => {
                        console.log(err);
                        this.$vs.loading.close();
                    });
            },
            add() {
                let me = this;
                if (me.prod !== '') {
                    const libro = this.producto?this.producto.find(libro => libro.nombrelibro === me.prod.nombrelibro):'';
                    const libros = this.arregloLibros?this.arregloLibros.find(libro => libro.nombrelibro === me.prod.nombrelibro):'';
                    !libro?console.log('ERROR producto'):!libros?console.log('ERROR arreglo libros'):'';
                    if (libro) {
                        let Datos = '';
                        Datos = {
                            det_prof_id: '',
                            pro_codigo: me.prod.codigo_liquidacion,
                            det_prof_cantidad: 0,
                            cantidad: '',
                            det_prof_valor_u: me.prod.precio,
                            nombre: me.prod.nombrelibro,
                            nombre_serie: me.prod.serieArea,
                            pro_des_por: me.prod.descuento,
                            prof_iva_por: 0,
                            valor: me.prod.valor,
                            stock: me.prod.stock,
                            subtotal: 0,
                            despacho: me.prod.despacho,
                            nuevo: 0,
                        };
                        this.inputs.unshift(Datos);
                        const index = this.producto.indexOf(libro);
                        if (index > -1) {
                            this.producto.splice(index, 1);
                        }
                        me.prod = '';
                    } else if (libros) {
                        let Datos = '';
                        if (me.accionProforma == 0) {
                            Datos = {
                                det_prof_id: '',
                                codigo_liquidacion: me.prod.codigo,
                                det_prof_cantidad: 0,
                                cantidad: '',
                                precio: me.prod.precio,
                                nombrelibro: me.prod.nombrelibro,
                                nombre_serie: me.prod.serieArea,
                                pro_des_por: 0,
                                prof_iva_por: 0,
                                valor: me.prod.valor,
                                stock: me.prod.stock,
                                subtotal: 0,
                                despacho: me.prod.despacho,
                            };
                        } else
                        if (me.accionProforma == 1) {
                            Datos = {
                                det_prof_id: '',
                                pro_codigo: me.prod.codigo,
                                det_prof_cantidad: 0,
                                cantidad: '',
                                det_prof_valor_u: me.prod.precio,
                                nombre: me.prod.nombrelibro,
                                nombre_serie: me.prod.serieArea,
                                pro_des_por: 0,
                                prof_iva_por: 0,
                                valor: me.prod.valor,
                                stock: me.prod.stock,
                                subtotal: 0,
                                despacho: me.prod.despacho,
                                nuevo: 0,
                            };
                        }
                        this.inputs.unshift(Datos);
                        const index = this.arregloLibros.indexOf(libros);
                        if (index > -1) {
                            this.arregloLibros.splice(index, 1);
                        }
                        me.prod = '';
                    } else {
                        console.error('El libro seleccionado no se encuentra en el arreglo de libros.');
                    }
                } else {
                    console.error('No se ha seleccionado ningún libro.');
                }
                me.inputs.forEach(el => {
                    if (el.stock < this.stock) {
                        this.conta = this.conta + 1;
                    }
                });
            },
            async getadd() {
                this.producto = [];
                await this.venta(this.setMenu);
                if (this.setMenu == 0) {
                    await this.getinfopedido();
                }
                if (this.setMenu == 1) {
                    await this.getinfopedidoDespacho();
                }
                if (this.setMenu == 3) {
                    if (this.tip == 0) {
                        await this.getinfopedido();
                    }
                    if (this.tip == 1) {
                        await this.getinfopedidoDespacho();
                    }
                }
                if (this.producto.length !== 0 && this.ventas.length !== 0) {
                    let productoToRemove = []; // Almacena los índices de los elementos a eliminar de this.producto
                    let ventasToRemove = []; // Almacena los índices de los elementos a eliminar de this.ventas
                    this.producto.forEach((input, i) => {
                        input.despacho = 0;
                        let shouldRemoveInput = false; // Variable para verificar si se debe eliminar el input
                        this.ventas.forEach((venta, j) => {
                            if (input.codigo_liquidacion === venta.pro_codigo) {
                                if (input.valor > venta.cantidad) {
                                    input.despacho = venta.cantidad;
                                } else if (input.valor == venta.cantidad) {
                                    shouldRemoveInput = true; // No se debe eliminar el input
                                    ventasToRemove.push(j); // Agrega el índice de la venta a eliminar
                                } else {
                                    shouldRemoveInput = true; // No se debe eliminar el input
                                    ventasToRemove.push(j); // Agrega el índice de la venta a eliminar
                                }
                            }
                        });
                        if (shouldRemoveInput) {
                            productoToRemove.push(i); // Agrega el índice del input a eliminar
                        }
                    });
    
                    // Elimina los elementos de los arrays this.producto y this.ventas
                    productoToRemove.reverse().forEach(index => {
                        this.producto.splice(index, 1);
                    });
    
                    ventasToRemove.reverse().forEach(index => {
                        this.ventas.splice(index, 1);
                    });
                }
                if (this.producto.length !== 0 && this.inputs.length !== 0) {
                    let productToRemove = []; // Almacena los índices de los elementos a eliminar de this.producto
    
                    this.producto.forEach((input, i) => {
                        let shouldRemoveInpu = false; // Variable para verificar si se debe eliminar el input
                        this.inputs.forEach((venta, j) => {
                            if (input.codigo_liquidacion === venta.pro_codigo) {
                                shouldRemoveInpu = true; // No se debe eliminar el input
                            }
                        });
                        if (shouldRemoveInpu) {
                            productToRemove.push(i); // Agrega el índice del input a eliminar
                        }
                    });
                    // Elimina los elementos de los arrays this.producto y this.ventas
                    productToRemove.reverse().forEach(index => {
                        this.producto.splice(index, 1);
                    });
                }
    
                // Si this.ventas está vacío pero this.producto tiene elementos
                if (this.producto.length !== 0 && this.ventas.length === 0) {
                    // Itera sobre los elementos de this.producto
                    this.producto.forEach(input => {
                        // Establece despacho en 0
                        input.despacho = 0;
                    });
                }
    
            },
            async getinfopedido() {
                let buscar;
                if (this.setMenu == 3 && this.tip == 0) {
                    buscar = this.id1;
                } else {
                    buscar = this.sendPedido.id_pedido;
                }
                await this.$http.get(this.$server_url + 'get_val_pedidoInfoTodoSuma/' + buscar)
                    .then(res => {
                        this.producto = res.data;
                    })
                    .catch(err => {
                        console.log(err)
                    });
            },
            async getinfopedidoDespacho() {
                let buscar;
                let b;
                if (this.setMenu == 3 && this.tip == 1) {
                    buscar = this.id1;
                    b = this.idperiodo
    
                } else {
                    buscar = this.setPuntos.ca_codigo_agrupado;
                    b = this.setPuntos.id_periodo
                }
                await this.$http.get(this.$server_url + `pedidosDespacho?id_despacho=${buscar}&id_periodo=${b}`)
                    .then(res => {
                        this.producto = res.data;
                    })
                    .catch(err => {
                        console.log(err)
                    });
            },
            verificaciones() {
                if (this.proforma.mas == false) {
                    this.inputs.forEach(el => {
                        if ((el.valor - el.despacho) < el.cantidad) {
                            el.cantidad = '';
                        }
                    });
                }
            },
            verificar(event, inputvs) {
                // Verificar si la tecla presionada es un número
                if (this.proforma.mas == false) {
                    if (this.proforma.activa == true) {
                        if (inputvs.cantidad > inputvs.stock) {
                            event.preventDefault();
                            return;
                        }
                    } else if (this.proforma.activa == false) {
                        if (inputvs.cantidad > parseInt(inputvs.stock - this.stock)) {
                            event.preventDefault();
                            return;
                        }
                    }
                }
            },
            handleKeyPress(event, inputvs) {
                // Obtener el valor máximo permitido
                if (this.proforma.mas == false) {
                    let maxValue;
                    if (this.proforma.activa == true) {
                        if (parseFloat(inputvs.valor - inputvs.despacho) <= inputvs.stock) {
                            maxValue = parseFloat(inputvs.valor - inputvs.despacho);
                        } else {
                            maxValue = parseFloat(inputvs.stock)
                        }
                    } else {
                        if (parseFloat(inputvs.valor - inputvs.despacho) <= (inputvs.stock - this.stock)) {
                            maxValue = parseFloat(inputvs.valor - inputvs.despacho);
                        } else {
                            if (parseFloat(inputvs.stock - this.stock) >= 0) {
                                maxValue = parseFloat(inputvs.stock - this.stock);
                            } else {
                                maxValue = 0;
                            }
                        }
                    }
                    // Obtener el valor ingresado
                    let enteredValue = parseFloat(event.target.value + event.key);
    
                    // Si el valor ingresado excede el valor máximo permitido, prevenir la acción por defecto
                    if (enteredValue > maxValue) {
                        // console.log("uno", enteredValue)
                        // console.log("dos", maxValue)
                        inputvs.cantidad=maxValue;
                        event.preventDefault();
                        this.$vs.notify({
                            text: "No se permite el ingreso de valores mayor a cantidad faltante",
                            color: "danger",
                            iconPack: "feather",
                            icon: "icon-alert-triangle",
                        });
                    }
                } // Verificar si la tecla presionada es un número
                if (!/\d/.test(event.key)) {
                    event.preventDefault();
                    return;
                }
            },
            handlePaste(event, inputvs) {
                // Obtener el valor máximo permitido
                if (this.proforma.mas == false) {
                    let maxValue;
                    if (this.proforma.activa == true) {
                        if (parseFloat(inputvs.valor - inputvs.despacho) <= inputvs.stock) {
                            maxValue = parseFloat(inputvs.valor - inputvs.despacho);
                        } else {
                            maxValue = parseFloat(inputvs.stock)
                        }
                    } else {
                        if (parseFloat(inputvs.valor - inputvs.despacho) <= (inputvs.stock - this.stock)) {
                            maxValue = parseFloat(inputvs.valor - inputvs.despacho);
                        } else {
                            if (parseFloat(inputvs.stock - this.stock) >= 0) {
                                maxValue = parseFloat(inputvs.stock - this.stock);
                            } else {
                                maxValue = 0;
                            }
                        }
                    }
    
                    // Obtener el texto pegado
                    let pastedText = (event.clipboardData || window.clipboardData).getData('text');
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
                } // Verificar si el texto pegado contiene solo números
                if (!/^\d+$/.test(pastedText)) {
                    event.preventDefault();
                    return;
                }
            },
            guardarnuevo1() {
                let me = this;
                
                if (me.inputs.length == 0) {
                    me.$vs.notify({
                        text: "Agregue al menos un item",
                        color: "danger",
                        iconPack: "feather",
                        icon: "icon-alert-triangle",
                    });
                    return;
                }
    
                //si no existe ninguna cantidad mayor a cero
                let precantidad = me.inputs.filter(el => el.cantidad > 0).length;
                    if (precantidad == 0) {
                        me.$vs.notify({
                            text: "Agrege al menos un valor mayor a cero",
                            color: "danger",
                            iconPack: "feather",
                            icon: "icon-alert-triangle",
                        });
                        return;
                    }
    
                //this.getpro();
                const usuariorespo = localStorage.getItem("usuario");
                const usuarioObjeto = JSON.parse(usuariorespo);
                let idgroup = usuarioObjeto.id_group;
                // let tipoproforma = '';
                // if (idgroup == 22 || idgroup == 23) {
                //     tipoproforma = 1;
                // } else if (idgroup == 33) {
                //     tipoproforma = 0;
                // } else {
                //     tipoproforma = 2;
                // }
                let tipoproforma = 0;
    
                let formData = new FormData();
    
                let b = 1;
                if (this.setMenu != 3) {
                    if (!me.proforma.empresa) {
                        me.$vs.notify({
                            text: "Seleccione una empresa",
                            color: "danger",
                            iconPack: "feather",
                            icon: "icon-alert-triangle",
                        });
                        me.$vs.loading.close()
                        return;
                    }
                    // if(!me.proforma.des){
                    //     me.$vs.notify({
                    //         text: "Verifique el descuento",
                    //         color: "danger",
                    //         iconPack: "feather",
                    //         icon: "icon-alert-triangle",
                    //     });
                    //     if (me.proforma.des==0) {
                    //         me.proforma.des='';
                    //     }
                    //     me.$vs.loading.close()
                    //     return;
                    // }
                    if (me.proforma.des === undefined || (me.proforma.des === 0 && me.proforma.des !== '')) {
                        me.proforma.des = '';
                    } else if (!me.proforma.des) {
                        me.$vs.notify({
                            text: "Verifique el descuento",
                            color: "danger",
                            iconPack: "feather",
                            icon: "icon-alert-triangle",
                        });
                        me.$vs.loading.close();
                        return;
                    }
                    if (!me.proforma.observacion) {
                        me.$vs.notify({
                            text: "Escriba la observacion",
                            color: "danger",
                            iconPack: "feather",
                            icon: "icon-alert-triangle",
                        });
                        me.$vs.loading.close()
                        return;
                    }
                    //clientesidPerseo no puede ser vacio ni nulo ni cero ni undefined
                    if (!me.datosDespachoSelect.clientesidPerseo) {
                        me.$vs.notify({
                            text: "Seleccione un cliente",
                            color: "danger",
                            iconPack: "feather",
                            icon: "icon-alert-triangle",
                        });
                        me.$vs.loading.close()
                        return;
                    }
                    //valido si es activo isActiveCupo el total no puede ser mayor a cupo
                    if (me.isActiveCupo && this.setPuntos.ca_tipo_pedido == 2) {
                        if (me.proforma.tot > me.proforma.cupo) {
                            me.$vs.notify({
                                text: "El total no puede ser mayor al cupo",
                                color: "danger",
                                iconPack: "feather",
                                icon: "icon-alert-triangle",
                            });
                            me.$vs.loading.close()
                            return;
                        }
                    }
                    if (!me.datosDespachoSelect.id_institucion) {
                        me.$vs.notify({
                            text: "Seleccione la libreria",
                            color: "danger",
                            iconPack: "feather",
                            icon: "icon-alert-triangle",
                        });
                        me.$vs.loading.close()
                        return;
                    }
                    //que nombre de cliente sea obligatorio y no puede ser nulo vacio o undefined
                    if (!me.datosDespachoSelect.nombre) {
                        me.$vs.notify({
                            text: "Seleccione un cliente",
                            color: "danger",
                            iconPack: "feather",
                            icon: "icon-alert-triangle",
                        });
                        me.$vs.loading.close()
                        return;
                    }
                    // if (!me.proforma.empresa == 0) {
                    //     me.$vs.notify({
                    //         text: "Seleccione la empresa",
                    //         color: "danger",
                    //         iconPack: "feather",
                    //         icon: "icon-alert-triangle",
                    //     });
                    //     me.$vs.loading.close()
                    //     return;
                    // }
                    if (!me.proforma.iva) {
                        me.$vs.notify({
                            text: "Seleccione el iva",
                            color: "danger",
                            iconPack: "feather",
                            icon: "icon-alert-triangle",
                        });
                        me.$vs.loading.close()
                        return;
                    }
                    if (me.proforma.des == undefined || me.proforma.des == null) {
                        me.$vs.notify({
                            text: "Seleccione los descuento a aplicar",
                            color: "danger",
                            iconPack: "feather",
                            icon: "icon-alert-triangle",
                        });
                        me.$vs.loading.close()
                        return;
                    }
                    if (me.proforma.observacion == 0 || me.proforma.observacion == null) {
                        me.$vs.notify({
                            text: "Escriba la observacion",
                            color: "danger",
                            iconPack: "feather",
                            icon: "icon-alert-triangle",
                        });
                        me.$vs.loading.close()
                        return;
                    }
                }
                // me.$vs.loading()
                if (me.inputs.length == 0) {
                    me.$vs.notify({
                        text: "Agregue al menos un item",
                        color: "danger",
                        iconPack: "feather",
                        icon: "icon-alert-triangle",
                    });
                     me.$vs.loading.close()
                    return;
                } else {
                    me.inputs.forEach((el, index) => {
                        if (me.setMenu === 3) {
                            // Caso cuando setMenu es igual a 3
                            if (parseInt(el.cantidad) > parseInt(el.stock - me.stock)) {
                                this.inputs.splice(index, 1);
                                // Reducimos el índice en 1 para compensar el splice
                                index--;
                            }
                        } else {
                            // Caso cuando setMenu no es igual a 3
                            if (me.proforma.activa) {
                                // Cuando la proforma está activa
                                if (parseInt(el.cantidad) > parseInt(el.stock)) {
                                    this.inputs.splice(index, 1);
                                    index--;
                                }
                            } else {
                                // Cuando la proforma no está activa
                                if (parseInt(el.cantidad) > parseInt(el.stock - me.stock)) {
                                    this.inputs.splice(index, 1);
                                    index--;
                                }
                            }
                        }
                    });
                    me.calculos();
                }
                formData.append("data_detalle", JSON.stringify(me.inputs));
                formData.append("usu_codigo", parseInt(me.idusuarioresp));
                if (this.setMenu == 0) {
                    formData.append("pedido_id", parseInt(me.sendPedido.id_pedido));
                    formData.append("idPuntoventa", '');
                }
                if (this.setMenu == 1) {
                    formData.append("idPuntoventa", me.setPuntos.ca_codigo_agrupado);
                    formData.append("pedido_id", '');
                }
                //setMenu 3 =>  libreria           
                if (this.setMenu == 3) {
                    formData.append("prof_id", '');
                    if (me.tip == 1) {
                        formData.append("pedido_id", '');
                        formData.append("idPuntoventa", me.id1);
                        formData.append("pro_des_por", 0);
                        formData.append("prof_com", 0);
                    }
                    let c = (me.inputs.reduce((prev, curr) => prev + parseFloat(curr.subtotal), 0) * parseFloat(me.descuento / 100)).toFixed(2);
                    let d = parseFloat(me.inputs.reduce((prev, curr) => prev + parseFloat(curr.subtotal), 0) - parseFloat(c)).toFixed(2);
                    formData.append("prof_observacion_libreria", me.proforma.libreria);
                    formData.append("emp_id", '');
                    formData.append("prof_iva", 0);
                    formData.append("prof_iva_por", 0);
                    formData.append("prof_descuento", parseFloat(c));
                    formData.append("prof_total", parseFloat(d));
                    if (!me.proforma.libreria){
                    me.$vs.notify({
                            text: "Escriba la observacion para guardar",
                            color: "danger",
                            iconPack: "feather",
                            icon: "icon-alert-triangle",
                        });
                        return;
                }
                } else {
                    formData.append("prof_id", me.proforma.id);
                    formData.append("prof_observacion", me.proforma.observacion);
                    formData.append("prof_observacion_libreria", '');
                    formData.append("emp_id", parseInt(me.proforma.empresa.id));
                    if (me.tipo == 0) {
                        formData.append("pro_des_por", me.proforma.des);
                    } else {
                        formData.append("pro_des_por", me.proforma.des);
                    }
                    formData.append("prof_iva", parseFloat(me.proforma.iv));
                    formData.append("prof_iva_por", 0);
                    formData.append("prof_descuento", parseFloat(me.proforma.desco));
                    formData.append("prof_total", parseFloat(me.proforma.tot));
                    formData.append("prof_com", me.proforma.dec.value);
                    //cliente perseo
                    formData.append("clientesidPerseo", me.datosDespachoSelect.clientesidPerseo);
                    //CLIENTE
                    formData.append("ven_cliente", me.datosDespachoSelect.idusuario);
                }
                //DESPACHO
                formData.append("id_ins_depacho", me.datosDespachoSelect.id_institucion);
                formData.append("prof_estado", b);
                formData.append("prof_tipo_proforma", tipoproforma);
                formData.append("created_at", me.mostrarFechayhora());
                formData.append('iniciales', me.usuario.iniciales)
                formData.append('idusuario', me.usuario.idusuario)
                formData.append('id_group', me.usuario.id_group)
                if (this.setMenu === 3 && !me.proforma.libreria && this.setMenu ==3){
                    me.$vs.notify({
                            text: "Escriba la observacion para guardar",
                            color: "danger",
                            iconPack: "feather",
                            icon: "icon-alert-triangle",
                        });
                        return;
                }
                me.$vs.loading();
                this.$http
                    .post(this.$server_url + "Proforma_Registrar_modificar_solicitud", formData)
                    .then((res) => {
                        me.$vs.loading.close();
                        if (res.status === 200) {
                            me.$vs.notify({
                                text: res.data.message,
                                color: 'success',
                                iconPack: 'feather',
                                icon: 'icon-check'
                            });
                        }
                        if (res.status === 500) {
                            me.$vs.notify({
                                text: res.data.message,
                                color: 'danger',
                                iconPack: 'feather',
                                icon: 'icon-check'
                            });
                        }
                        me.$emit("change", true);
                    })
                    .catch(function () {
                        me.$vs.loading.close();
                        me.$vs.notify({
                            text: "Proforma no se puede guardar",
                            color: "danger",
                            iconPack: "feather",
                            icon: "icon-x",
                        });
                    });
            },
            mostrarFechayhora: function () {
                const date = new Date();
                const formatear =
                    date.getFullYear() +
                    "-" +
                    ("0" + (date.getMonth() + 1)).slice(-2) +
                    "-" +
                    ("0" + date.getDate()).slice(-2) +
                    " " +
                    ("0" + date.getHours()).slice(-2) +
                    ":" +
                    ("0" + date.getMinutes()).slice(-2) +
                    ":" +
                    ("0" + date.getSeconds()).slice(-2);
    
                return formatear;
            },
            editar() {
                let me = this;
                if (me.setMenu != 3) {
                    //seleccione el emp_id
                    if (me.proforma.empresa.id == 0 || me.proforma.empresa.id == "" || me.proforma.empresa.id == null || me.proforma.empresa.id == undefined) {
                        me.$vs.notify({
                            text: "Seleccione una empresa",
                            color: "danger",
                            iconPack: "feather",
                            icon: "icon-alert-triangle",
                        });
                        return;
                    }
                    if (me.proforma.observacion == 0 || me.proforma.observacion == null) {
                        me.$vs.notify({
                            text: "Escriba la observacion",
                            color: "danger",
                            iconPack: "feather",
                            icon: "icon-alert-triangle",
                        });
                        return;
                    }
                    //clientesidPerseo no puede ser vacio ni nulo ni cero ni undefined
                    if (me.datosDespachoSelect.clientesidPerseo == '' || me.datosDespachoSelect.clientesidPerseo == null || me.datosDespachoSelect.clientesidPerseo == 0 || me.datosDespachoSelect.clientesidPerseo == undefined) {
                        me.$vs.notify({
                            text: "Seleccione un cliente",
                            color: "danger",
                            iconPack: "feather",
                            icon: "icon-alert-triangle",
                        });
                        return;
                    }
                    //valido si es activo isActiveCupo el total no puede ser mayor a cupo
                    if (me.isActiveCupo && this.setPuntos.ca_tipo_pedido == 2) {
                        if (me.proforma.tot > me.proforma.cupo) {
                            me.$vs.notify({
                                text: "El total no puede ser mayor al cupo",
                                color: "danger",
                                iconPack: "feather",
                                icon: "icon-alert-triangle",
                            });
                            return;
                        }
                    }
                    //que despacho o libreria sea obligatorio y no puede ser nulo vacio o undefined
                    if (me.datosDespachoSelect.id_institucion == '' || me.datosDespachoSelect.id_institucion == null || me.datosDespachoSelect.id_institucion == undefined) {
                        me.$vs.notify({
                            text: "Seleccione la libreria",
                            color: "danger",
                            iconPack: "feather",
                            icon: "icon-alert-triangle",
                        });
                        return;
                    }
                    //que nombre de cliente sea obligatorio y no puede ser nulo vacio o undefined
                    if (me.datosDespachoSelect.nombre == '' || me.datosDespachoSelect.nombre == null || me.datosDespachoSelect.nombre == undefined) {
                        me.$vs.notify({
                            text: "Seleccione un cliente",
                            color: "danger",
                            iconPack: "feather",
                            icon: "icon-alert-triangle",
                        });
                        return;
                    }
                    if (me.proforma.empresa === 0 || me.proforma.empresa === null || me.proforma.observacion === 0 || me.proforma.observacion === null) {
                        me.$vs.notify({
                            text: "Ingrese los datos antes de guardar",
                            color: "danger",
                            iconPack: "feather",
                            icon: "icon-alert-triangle",
                        });
                    }
                }
                const usuariorespo = localStorage.getItem("usuario");
                const usuarioObjeto = JSON.parse(usuariorespo);
                let idusuario = usuarioObjeto.idusuario;
                let grupo = usuarioObjeto.id_group;
                // if ((grupo == 23 || grupo == 22 || grupo == 1) & (me.proforma.id == '' || me.proforma.id == null || me.proforma.id == 0)) {
                //     me.getpro();
                // }
                if (me.editan.length != 0 && me.inputs.length != 0) {
                    for (let i = 0; i < me.inputs.length; i++) {
                        // Recorrer el segundo array
                        for (let j = 0; j < me.editan.length; j++) {
                            if (me.inputs[i].pro_codigo == me.editan[j].pro_codigo) {
                                me.inputs[i].nuevo = parseInt(me.editan[j].det_prof_cantidad) - parseInt(me.inputs[i].cantidad);
                            }
                        }
                    }
                }
    
                if (me.inputs.length === 0) {
                    me.$vs.notify({
                        text: "Agregue detalles antes de guardar",
                        color: "danger",
                        iconPack: "feather",
                        icon: "icon-alert-triangle",
                    });
                } else {
                    me.inputs.forEach((el, index) => {
                        if (me.setMenu === 3) {
                            // Caso cuando setMenu es igual a 3
                            if (parseInt(el.cantidad - el.det_prof_cantidad) > parseInt(el.stock - me.stock)) {
                                this.inputs.splice(index, 1);
                                index--; // Reducimos el índice en 1 después de eliminar un elemento
                            }
                        } else {
                            // Caso cuando setMenu no es igual a 3
                            if (me.proforma.activa) {
                                // Cuando la proforma está activa
                                if (el.nuevo != 0) {
                                    if (parseInt(el.cantidad - el.det_prof_cantidad) > parseInt(el.stock)) {
                                        if (el.det_prof_cantidad == 0) {
                                            this.inputs.splice(index, 1);
                                            index--; // Reducimos el índice en 1 después de eliminar un elemento
                                        } else {
                                            el.cantidad = el.det_prof_cantidad;
                                        }
                                    }
                                }
                            } else {
                                // Cuando la proforma no está activa
                                if (el.nuevo != 0) {
                                    if (parseInt(el.cantidad - el.det_prof_cantidad) > parseInt(el.stock - me.stock)) {
                                        if (el.det_prof_cantidad == 0) {
                                            this.inputs.splice(index, 1);
                                            index--; // Reducimos el índice en 1 después de eliminar un elemento
                                        } else {
                                            el.cantidad = el.det_prof_cantidad;
                                        }
    
                                    }
                                }
                            }
                        }
                    });
                    me.calculos();
                }
                let formData = new FormData();
    
                if (me.setMenu == 3) {
                    if (me.proforma.libreria == 0 || me.proforma.libreria == null) {
                        me.$vs.notify({
                            text: "Escriba la observacion",
                            color: "danger",
                            iconPack: "feather",
                            icon: "icon-alert-triangle",
                        });
                        return;
                    }
                    let c = (me.inputs.reduce((prev, curr) => prev + parseFloat(curr.subtotal), 0) * parseFloat(me.descuento / 100)).toFixed(2);
                    let e = ((me.inputs.reduce((prev, curr) => prev + parseFloat(curr.subtotal), 0) - parseFloat(c)) * parseFloat(me.iva / 100)).toFixed(2);
                    let d = parseFloat(me.inputs.reduce((prev, curr) => prev + parseFloat(curr.subtotal), 0) - parseFloat(c) + parseFloat(e)).toFixed(2);
                    formData.append("prof_observacion_libreria", me.proforma.libreria);
                    formData.append("pro_des_por", parseFloat(me.descuento));
                    formData.append("prof_iva", parseFloat(e));
                    formData.append("prof_iva_por", 0);
                    formData.append("prof_descuento", parseFloat(c));
                    formData.append("prof_total", parseFloat(d));
                } else {
                    formData.append("prof_observacion", me.proforma.observacion);
                    formData.append("prof_observacion_libreria", me.proforma.libobservacion);
                    formData.append("prof_id", me.proforma.id);
                    formData.append("emp_id", me.proforma.empresa.id);
                    formData.append("pro_des_por", parseFloat(me.proforma.des));
                    formData.append("prof_iva", parseFloat(me.proforma.iv));
                    formData.append("prof_iva_por", 0);
                    formData.append("prof_descuento", parseFloat(me.proforma.desco));
                    formData.append("prof_total", parseFloat(me.proforma.tot));
                    //cliente perseo
                    formData.append("clientesidPerseo", me.datosDespachoSelect.clientesidPerseo);
                    //CLIENTE
                    formData.append("ven_cliente", me.datosDespachoSelect.idusuario);
                }
                //DESPACHO
                formData.append("id_ins_depacho", me.datosDespachoSelect.id_institucion);
                formData.append("data_detalle", JSON.stringify(me.inputs));
                formData.append("id", me.proforma.codigo);
                formData.append("updated_at", me.mostrarFechayhora());
                formData.append("id_usua", idusuario);
                formData.append('iniciales', me.usuario.iniciales)
                formData.append('id_group', me.usuario.id_group)
                //si es usuario facturador y la proforma es creado por la libreria envio estado 4 de preaprobado
                formData.append("estado", 1);
                //     if ((grupo == 22 || grupo == 23 || grupo == 1) && me.ObjectEdit.prof_tipo_proforma == 0) {
                // }
                me.$vs.loading();
                this.$http
                    .post(this.$server_url + "PostProforma_Editar_solicitud", formData)
                    .then((res) => {
                        me.$vs.loading.close();
                        // me.getproforma();
                        if (res.status === 200) {
                            me.$vs.notify({
                                text: res.data.message,
                                color: 'success',
                                iconPack: 'feather',
                                icon: 'icon-check'
                            });
                        }
                        if (res.status === 500) {
                            me.$vs.notify({
                                text: res.data.message,
                                color: 'danger',
                                iconPack: 'feather',
                                icon: 'icon-check'
                            });
                        }
                        if (me.conta == 0) {
                            me.$emit("change", true);
                        } else {
                            me.$emit("change", false);
                        }
                        //     this.popupproforma = false;
                    })
                    .catch(() => {
                        me.$vs.loading.close();
                        // me.getproforma();
                        me.$vs.notify({
                            text: "No se pudo actualizar la proforma",
                            color: "danger",
                            iconPack: "feather",
                            icon: "icon-x",
                        });
                    });
            },
        }
    };
    </script>
    <style>
    .popophijo {
        z-index: 51003;
        /* Valor mayor que el del popup del padre */
        position: fixed;
        /* Asegúrate de que la posición sea adecuada */
    }
    </style>
    