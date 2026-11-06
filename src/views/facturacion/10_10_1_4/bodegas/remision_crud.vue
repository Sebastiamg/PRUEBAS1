<template>
  <vx-card fixed-height="true">
    <vs-row vs-justify="flex-start">
      <vs-button type="border" color="success" class="mr-2" @click="getNuevo()">Agregar nueva remisión</vs-button>
    </vs-row>
    <vs-row>
      <vs-col type="flex" vs-justify="flex-start" vs-align="flex-start" class="m-2" vs-w="12">
        <p>Búsqueda por filtros</p>
        <br />
        <vs-card class="seccionmostrartodo">
          <div>
            <vs-input class="w-full" @keyup.enter="getRemisionParametro()" icon-after="true"
              label-placeholder="icon-after" style="margin: 0px 0px 20px 0px" icon="search" placeholder="Buscar"
              v-model="busquedaxcodigo" />
          </div>
          <div>
            <ul class="leftx" style="display: flex; margin: 0px 0px 0px 20px">
              <li class="modelx"></li>
              <li style="margin: 10px 20px 0px 0px">
                <vs-radio vs-name="radios1" vs-value="0" v-model="valorBusqueda"
                  @input="busqueda = 'codigo'">Iniciales</vs-radio>
              </li>
              <li style="margin: 10px 10px 0px 0px">
                <vs-radio vs-name="radios2" vs-value="1" v-model="valorBusqueda"
                  @input="busqueda = 'nombres'">Destinatario</vs-radio>
              </li>
              <li style="margin: 10px 10px 0px 0px">
                <vs-radio vs-name="radios3" vs-value="2" v-model="valorBusqueda" @input="busqueda = 'factura'">#
                  Factura</vs-radio>
              </li>
              <li>
                <vs-button color="warning" type="filled" style="margin-left: 10px" @click="getRemisionParametro()"
                  icon="search"></vs-button>
              </li>
            </ul>
          </div>
        </vs-card>
      </vs-col>
    </vs-row>
    <!-- <vs-button type="border" color="success" class="mr-2" @click="getNuevo()">Agregar Nuevo Producto</vs-button> -->
    <vs-table max-items="10" pagination search :data="Remision">
      <template slot="header">
        <vs-chip color="primary">Cantidad: <b> {{ Remision.length }}</b></vs-chip>
      </template>
      <!-- {{cliCi}} -->
      <template slot="thead">
        <vs-th width="100"> Id </vs-th>
        <vs-th width="600"> Información de Remisión </vs-th>
        <vs-th width="600"> Información del Destinatario </vs-th>
        <vs-th width="400"> Información del Transportista</vs-th>
        <vs-th width="300"> Detalles</vs-th>
        <vs-th width="300">Transporte</vs-th>
        <vs-th width="300">Encargado</vs-th>
        <vs-th width="400">Información de guía</vs-th>
        <vs-th width="500"> Fechas</vs-th>
        <vs-th width="100"> Acciones </vs-th>
      </template>
      <template slot-scope="{ data }">
        <vs-tr :key="indextr" v-for="(tr, indextr) in data">
          <vs-td :data="data[indextr].remi_codigo">
            {{ data[indextr].remi_codigo }}
          </vs-td>
          <vs-td>
            <small><b>Facturas #:</b> {{ tr.remi_num_factura }}</small><br />
            <small><b>Motivo:</b> {{ tr.mot_nombre }}</small><br />
            <small><b>Dirección de Partida:</b> {{ tr.remi_dir_partida }}</small><br />
          </vs-td>
          <vs-td>
            <small><b>RUC #:</b> {{ tr.remi_ruc_destinatario }}</small><br />
            <small><b>Nombres y apellidos:</b> {{ tr.remi_destinatario }}</small><br />
            <small><b>Dirección:</b> {{ tr.remi_direccion }}</small><br />
          </vs-td>
          <vs-td>
            <small><b>CI o RUC:</b> {{ tr.remi_ci_transportista }}</small><br />
            <small><b>Nombres y apellidos:</b> {{ tr.remi_nombre_transportista }}</small><br />
          </vs-td>
          <vs-td>
            <small><b>Detalle:</b> {{ tr.remi_detalle }}</small><br />
            <small><b>Cantidad:</b> {{ tr.remi_cantidad }}</small><br />
            <small><b>Medida:</b> {{ tr.remi_unidad_medida }}</small><br />
          </vs-td>
          <vs-td>
            {{ tr.trans_nombre }}
          </vs-td>
          <vs-td> {{ tr.remi_responsable }} </vs-td>
          <vs-td>
            <small><b>#:</b> {{ tr.remi_guia_remision }}</small><br />
            <small><b>Observacion:</b> {{ tr.remi_obs }}</small><br />
            <small><b>Nº Paquetes:</b> {{ tr.remi_paquete }}</small><br />
            <small><b>Nº Fundas:</b> {{ tr.remi_funda }}</small><br />
            <small><b>Nº Rollos:</b> {{ tr.remi_rollo }}</small><br />
            <small><b>Flete:</b><br />
              <vs-chip v-if="tr.remi_flete == 1" color="success">Si</vs-chip>
              <vs-chip v-else color="danger">No</vs-chip></small>
            <br /><br />
            <small><b>Pago:</b><br />
              <vs-chip v-if="tr.remi_pagado == 1" color="success">Si</vs-chip>
              <vs-chip v-else color="danger">No</vs-chip></small>
            <br />
          </vs-td>
          <vs-td>
            <small><b>Fecha Inicio:</b> {{ tr.remi_fecha_inicio }}</small><br />
            <small><b>Fecha Final:</b> {{ tr.remi_fecha_final }}</small><br />
          </vs-td>
          <vs-td :data="data[indextr].remi_codigo">
            <vs-dropdown vs-custom-content vs-trigger-click title="Opciones">
              <vs-button class="a-icons" href.prevent icon="more_vert" type="border"></vs-button>
              <vs-dropdown-menu style="width: 250px" class="cursor">
                <vs-dropdown-item>
                  <vs-button color="#28C76F" type="line" class="w-full" @click="popupActivo = true;getEditar(tr);">Editar</vs-button>
                  <vs-button color="#EA5455" type="line" class="w-full" @click="popupActivo = true;getPreguntaEliminar(tr);">Eliminar</vs-button>
                </vs-dropdown-item>
              </vs-dropdown-menu>
            </vs-dropdown>
          </vs-td>
        </vs-tr>
      </template>
    </vs-table>
    <!-- SECCION REGISTRO -->
    <vs-popup class="crear" title="Registro de Remisión" :active.sync="popupActivoGuardar" fullscreen>
      <vs-row>
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
          <b>Datos</b>
        </vs-col>
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
          <vs-row vs-type="flex" vs-justify="center" vs-w="6">
            <vs-col vs-justify="center" vs-align="center" vs-w="11" class="mx-2">
              <vs-input icon-no-border icon="edit" label="Nº Factura:" class="w-full inputx" v-model="tabRemision.remi_num_factura" />
            </vs-col>
          </vs-row>
          <vs-row vs-type="flex" vs-justify="center" vs-w="6">
            <vs-col vs-justify="center" vs-align="center" vs-w="11" class="mx-2">
              <p>Motivo: *</p>
              <v-select :options="options4" :reduce="(options4) => options4" density="comfortable" label="mot_nombre"
                class="w-full" value="mot_id" placeholder="--Seleccione--" v-model="tabRemision.remi_motivo" />
            </vs-col>
          </vs-row>
        </vs-col>
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
          <vs-row vs-type="flex" vs-justify="center" vs-w="4">
            <vs-col vs-align="center" vs-w="10" class="mx-2">
              <p>Empresa:</p>
              <v-select :options="listaEmpresas" :reduce="(listaEmpresas) => listaEmpresas.id" density="comfortable"
                name="direccion" label="nombre" class="w-full" value="id" placeholder="--Seleccione--" @input="getdir()"
                v-model="tabRemision.remi_idempresa" />
            </vs-col>
          </vs-row>
          <vs-row vs-type="flex" vs-justify="center" vs-w="8">
            <vs-col vs-align="center" vs-w="10" class="mx-2">
              <vs-input label="Dirección de partida: " class="w-full m-2" icon="" disabled
                v-model="tabRemision.remi_dir_partida" />
            </vs-col>
          </vs-row>
        </vs-col>
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
          <b>Datos del Destinatario</b>
        </vs-col>
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
          <vs-row vs-type="flex" vs-justify="center" vs-w="6">
            <vs-col vs-justify="center" vs-align="center" vs-w="11" class="mx-2">
              <vs-input icon-no-border icon="account_circle" label="Nombres y apellidos: *"
                placeholder="LIBRERIA NUEVA GENERACION" class="w-full inputx" v-model="tabRemision.remi_destinatario" />
            </vs-col>
          </vs-row>
          <vs-row vs-type="flex" vs-justify="center" vs-w="6">
            <vs-col vs-justify="center" vs-align="center" vs-w="11" class="mx-2">
              <vs-input label="RUC: *" placeholder="00000000000000" class="w-full inputx" icon="mode_edit"
                v-model="tabRemision.remi_ruc_destinatario" />
            </vs-col>
          </vs-row>
        </vs-col>
        <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
          <vs-row vs-type="flex" vs-justify="center" vs-w="12">
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10" class="m-2">
              <vs-input icon="mode_edit" class="w-full inputx" placeholder="Quito av. La Prensa y Vaca De Castro"
                label="Dirección de destinatario:" v-model="tabRemision.remi_direccion" />
            </vs-col>
          </vs-row>
        </vs-col>
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
          <b>Datos del Transportista</b>
        </vs-col>
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
          <vs-row vs-type="flex" vs-justify="center" vs-w="6">
            <vs-col vs-justify="center" vs-align="center" vs-w="11" class="mx-2">
              <vs-input icon="mode_edit" class="w-full inputx" placeholder="0000000000" label="# Cédula:"
                v-model="tabRemision.remi_ci_transportista" />
            </vs-col>
          </vs-row>
          <vs-row vs-type="flex" vs-justify="center" vs-w="6">
            <vs-col vs-justify="center" vs-align="center" vs-w="11" class="mx-2">
              <vs-input icon="mode_edit" class="w-full inputx" placeholder="Luis Peréz" label="Nombres y apellidos:"
                v-model="tabRemision.remi_nombre_transportista" />
            </vs-col>
          </vs-row>
        </vs-col>
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
          <b>Datos del Detalle</b>
        </vs-col>
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
          <vs-row vs-type="flex" vs-justify="center" vs-w="4">
            <vs-col vs-justify="center" vs-align="center" vs-w="11" class="mx-2">
              <p>Nombre: *</p>
              <v-select :options="options1" :reduce="(options1) => options1" density="comfortable" label="text"
                class="w-full" value="value" placeholder="--Seleccione--" v-model="tabRemision.remi_detalle" />

            </vs-col>
          </vs-row>
          <vs-row vs-type="flex" vs-justify="center" vs-w="4">
            <vs-col vs-justify="center" vs-align="center" vs-w="11" class="mx-2">
              <vs-input label="Cantidad:" icon="mode_edit" class="w-full inputx" type="number"
                v-model="tabRemision.remi_cantidad" />
            </vs-col>
          </vs-row>
          <vs-row vs-type="flex" vs-justify="center" vs-w="4">
            <vs-col vs-justify="center" vs-align="center" vs-w="11" class="mx-2">
              <p>Medida: *</p>
              <v-select :options="options2" :reduce="(options2) => options2" density="comfortable" label="text"
                class="w-full" value="value" placeholder="--Seleccione--" v-model="tabRemision.remi_unidad_medida" />

            </vs-col>
          </vs-row>
        </vs-col>
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
          <b>Datos de Guia</b>
        </vs-col>
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
          <vs-row vs-type="flex" vs-justify="center" vs-w="6">
            <vs-col vs-justify="center" vs-align="center" vs-w="11" class="mx-2">
              <p>Transporte: *</p>
              <v-select :options="transporte" :reduce="(transporte) => transporte" density="comfortable"
                label="trans_nombre" class="w-full" value="trans_nombre" placeholder="--Seleccione--"
                v-model="tabRemision.trans_codigo" />

            </vs-col>
          </vs-row>
          <vs-row vs-type="flex" vs-justify="center" vs-w="6">
            <vs-col vs-justify="center" vs-align="center" vs-w="11" class="mx-2">
              <vs-input icon="mode_edit" class="w-full inputx" label="Guia Remision:" placeholder="prolipa-000000"
                v-model="tabRemision.remi_guia_remision" />
            </vs-col>
          </vs-row>
        </vs-col>
        <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
          <vs-row vs-type="flex" vs-justify="center" vs-w="12">

            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10" class="m-2">
              <vs-input icon="mode_edit" class="w-full inputx" label="Observación:" placeholder="Escibe..."
                v-model="tabRemision.remi_obs" />
            </vs-col>
          </vs-row>
        </vs-col>
        <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
          <vs-row vs-type="flex" vs-justify="center" vs-w="12">
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="2" class="m-2">
              <vs-input icon="mode_edit" class="w-full inputx" label="Nº Paquetes:" placeholder="0" type="number"
                v-model="tabRemision.remi_paquete" />
            </vs-col>
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="2" class="m-2">
              <vs-input icon="mode_edit" class="w-full inputx" label="Nº Fundas:" placeholder="0" type="number"
                v-model="tabRemision.remi_funda" />
            </vs-col>
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="2" class="m-2">
              <vs-input icon="mode_edit" class="w-full inputx" label="Nº Rollos:" placeholder="0" type="number"
                v-model="tabRemision.remi_rollo" />
            </vs-col>
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="2" class="m-2">
              <label for="">Flete: </label>
              <vs-switch v-model="remi_flete" vs-icon-off="close" vs-icon-on="done" />
            </vs-col>
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="2" class="m-2">
              <label for="">Pago:</label>
              <vs-switch v-model="remi_pagado" vs-icon-off="close" vs-icon-on="done" />
            </vs-col>
          </vs-row>
        </vs-col>
      </vs-row>
      <br />
      <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="mt-2">
        <vs-button @click="guardarnuevo()" type="relief">Guardar</vs-button>&emsp;
        <vs-button @click="getCancelar()" color="danger" type="relief">Cancelar</vs-button>
      </vs-col>
    </vs-popup>
    <!-- SECCION EDITAR -->
    <vs-popup class="editar" :title="`Editar remisión: ${tabRemision.remi_codigo}`" :active.sync="popupActivoEditar"
      fullscreen>
      <vs-row>
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
          <b>Datos</b>
        </vs-col>
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
          <vs-row vs-type="flex" vs-justify="center" vs-w="6">
            <vs-col vs-justify="center" vs-align="center" vs-w="11" class="mx-2">
              <vs-input icon-no-border icon="edit" label="Nº Factura:" class="w-full inputx"
                v-model="tabRemision.remi_num_factura" />
            </vs-col>
          </vs-row>
          <vs-row vs-type="flex" vs-justify="center" vs-w="6">
            <vs-col vs-justify="center" vs-align="center" vs-w="11" class="mx-2">
              <p>Motivo: *</p>
              <v-select :options="options4" :reduce="(options4) => options4" density="comfortable" label="mot_nombre"
                class="w-full" value="mot_id" placeholder="--Seleccione--" v-model="tabRemision.remi_motivo" />
            </vs-col>
          </vs-row>
        </vs-col>
        <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
          <vs-row vs-type="flex" vs-justify="center" vs-w="12">
            <vs-col vs-type="flex" vs-align="center" vs-w="10" class="mx-2">
              <vs-input label="Dirección de partida: " class="w-full m-2" icon="mode_edit"
                v-model="tabRemision.remi_dir_partida" />
            </vs-col>
          </vs-row>
        </vs-col>
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
          <b>Datos del Destinatario</b>
        </vs-col>
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
          <vs-row vs-type="flex" vs-justify="center" vs-w="6">
            <vs-col vs-justify="center" vs-align="center" vs-w="11" class="mx-2">
              <vs-input icon-no-border icon="account_circle" label="Nombres y apellidos: *"
                placeholder="LIBRERIA NUEVA GENERACION" class="w-full inputx" v-model="tabRemision.remi_destinatario" />
            </vs-col>
          </vs-row>
          <vs-row vs-type="flex" vs-justify="center" vs-w="6">
            <vs-col vs-justify="center" vs-align="center" vs-w="11" class="mx-2">
              <vs-input label="RUC: *" placeholder="00000000000000" class="w-full inputx" icon="mode_edit"
                v-model="tabRemision.remi_ruc_destinatario" />
            </vs-col>
          </vs-row>
        </vs-col>
        <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
          <vs-row vs-type="flex" vs-justify="center" vs-w="12">
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10" class="m-2">
              <vs-input icon="mode_edit" class="w-full inputx" placeholder="Quito av. La Prensa y Vaca De Castro"
                label="Dirección de destinatario:" v-model="tabRemision.remi_direccion" />
            </vs-col>
          </vs-row>
        </vs-col>
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
          <b>Datos del Transportista</b>
        </vs-col>
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
          <vs-row vs-type="flex" vs-justify="center" vs-w="6">
            <vs-col vs-justify="center" vs-align="center" vs-w="11" class="mx-2">
              <vs-input icon="mode_edit" class="w-full inputx" placeholder="0000000000" label="# Cédula:"
                v-model="tabRemision.remi_ci_transportista" />
            </vs-col>
          </vs-row>
          <vs-row vs-type="flex" vs-justify="center" vs-w="6">
            <vs-col vs-justify="center" vs-align="center" vs-w="11" class="mx-2">
              <vs-input icon="mode_edit" class="w-full inputx" placeholder="Luis Peréz" label="Nombres y apellidos:"
                v-model="tabRemision.remi_nombre_transportista" />
            </vs-col>
          </vs-row>
        </vs-col>
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
          <b>Datos del Detalle</b>
        </vs-col>
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
          <vs-row vs-type="flex" vs-justify="center" vs-w="4">
            <vs-col vs-justify="center" vs-align="center" vs-w="11" class="mx-2">
              <p>Nombre: *</p>
              <v-select :options="options1" :reduce="(options1) => options1" density="comfortable" label="text"
                class="w-full" value="value" placeholder="--Seleccione--" v-model="tabRemision.remi_detalle" />

            </vs-col>
          </vs-row>
          <vs-row vs-type="flex" vs-justify="center" vs-w="4">
            <vs-col vs-justify="center" vs-align="center" vs-w="11" class="mx-2">
              <vs-input label="Cantidad:" icon="mode_edit" class="w-full inputx" type="number"
                v-model="tabRemision.remi_cantidad" />
            </vs-col>
          </vs-row>
          <vs-row vs-type="flex" vs-justify="center" vs-w="4">
            <vs-col vs-justify="center" vs-align="center" vs-w="11" class="mx-2">
              <p>Medida: *</p>
              <v-select :options="options2" :reduce="(options2) => options2" density="comfortable" label="text"
                class="w-full" value="value" placeholder="--Seleccione--" v-model="tabRemision.remi_unidad_medida" />

            </vs-col>
          </vs-row>
        </vs-col>
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
          <b>Datos de Guia</b>
        </vs-col>
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
          <vs-row vs-type="flex" vs-justify="center" vs-w="6">
            <vs-col vs-justify="center" vs-align="center" vs-w="11" class="mx-2">
              <p>Transporte: *</p>
              <v-select :options="transporte" :reduce="(transporte) => transporte" density="comfortable"
                label="trans_nombre" class="w-full" value="trans_nombre" placeholder="--Seleccione--"
                v-model="tabRemision.trans_codigo" />

            </vs-col>
          </vs-row>
          <vs-row vs-type="flex" vs-justify="center" vs-w="6">
            <vs-col vs-justify="center" vs-align="center" vs-w="11" class="mx-2">
              <vs-input icon="mode_edit" class="w-full inputx" label="Guia Remision:" placeholder="prolipa-000000"
                v-model="tabRemision.remi_guia_remision" />
            </vs-col>
          </vs-row>
        </vs-col>
        <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
          <vs-row vs-type="flex" vs-justify="center" vs-w="12">

            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10" class="m-2">
              <vs-input icon="mode_edit" class="w-full inputx" label="Observación:" placeholder="Escibe..."
                v-model="tabRemision.remi_obs" />
            </vs-col>
          </vs-row>
        </vs-col>
        <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
          <vs-row vs-type="flex" vs-justify="center" vs-w="12">
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="2" class="m-2">
              <vs-input icon="mode_edit" class="w-full inputx" label="Nº Paquetes:" placeholder="0" type="number"
                v-model="tabRemision.remi_paquete" />
            </vs-col>
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="2" class="m-2">
              <vs-input icon="mode_edit" class="w-full inputx" label="Nº Fundas:" placeholder="0" type="number"
                v-model="tabRemision.remi_funda" />
            </vs-col>
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="2" class="m-2">
              <vs-input icon="mode_edit" class="w-full inputx" label="Nº Rollos:" placeholder="0" type="number"
                v-model="tabRemision.remi_rollo" />
            </vs-col>
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="2" class="m-2">
              <label for="">Flete: </label>
              <vs-switch v-model="remi_flete" vs-icon-off="close" vs-icon-on="done" />
            </vs-col>
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="2" class="m-2">
              <label for="">Pago:</label>
              <vs-switch v-model="remi_pagado" vs-icon-off="close" vs-icon-on="done" />
            </vs-col>
          </vs-row>
        </vs-col>
      </vs-row>
      <br /><br />
      <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="mt-2">
        <vs-button @click="editar()" type="relief">Editar</vs-button>&emsp;
        <vs-button @click="getCancelar()" color="danger" type="relief">Cancelar</vs-button>
      </vs-col>
    </vs-popup>

    <vs-popup class="eliminar"
      :title="`¿Confirma que desea eliminar el registro de remisión con código: ${tabRemision.remi_codigo}?`"
      :active.sync="popupActivoEliminar">
      <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2"></vs-col>
      <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2">
        <vs-button @click="getEliminar()" type="relief">Aceptar</vs-button>
      </vs-col>
      <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2">
        <vs-button @click="getCancelar()" color="danger" type="relief">Cancelar</vs-button>
      </vs-col>
    </vs-popup>
  </vx-card>
</template>
<script async>
import Vue from "vue";
import axios from "axios";
import vSelect from "vue-select";
export default {
  data() {
    return {
      remi_flete: false,
      remi_pagado: false,
      search: "",
      search1: "",
      Remision: [],
      Motivo: [],
      popupActivoGuardar: false,
      popupActivoEditar: false,
      popupActivoDesactivar: false,
      popupActivoEliminar: false,
      tabRemision: {
        remi_num_factura: "",
        remi_idempresa:"",
        remi_motivo: "",
        remi_dir_partida: "",
        remi_destinatario: "",
        remi_ruc_destinatario: "",
        remi_direccion: "",
        remi_nombre_transportista: "",
        remi_ci_transportista: "",
        remi_detalle: "",
        remi_cantidad: "",
        remi_unidad_medida: "",
        trans_codigo: "",
        remi_guia_remision: "",
        remi_obs: "",
        remi_paquete: "",
        remi_funda: "",
        remi_rollo: "",
      },

      options1: [
        { text: "LIBROS", value: "LIBROS" },
        { text: "OBSEQUIOS", value: "OBSEQUIOS" },
        { text: "OTROS", value: "OTROS" },
      ],
      options2: [
        { text: "CARTONES", value: "CARTONES" },
        { text: "UNIDADES", value: "UNIDADES" },
        { text: "OTROS", value: "OTROS" },
      ],
      listaEmpresas:[],
      options3: [],
      options4: [],
      transporte:[],
      Remision_inactivos: [],
      busquedaxcodigo: "",
      valorBusqueda: "0",
      checkBox_mostrarinactivos: false,
    };
  },
  components: {
    "v-select": vSelect,
  },

  mounted() {
    var fecha = "";
    this.getRemision();
    var id_moti = "";
    var id_trans = "";
  },
  methods: {
    searchData() {
      let me = this;
      me.$vs.loading();

      this.$http
        .get(this.$server_url + "GetMotivo")
        .then((res) => {
          this.options4 = res.data;

          me.$vs.loading.close();
        })
        .catch((err) => {
          console.log(err);
          me.$vs.loading.close();
        });
    },
    searchData1() {
      let me = this;
      me.$vs.loading();

      this.$http
        .get(this.$server_url + "Get_Transporte")
        .then((res) => {
          this.transporte = res.data;

          me.$vs.loading.close();
        })
        .catch((err) => {
          console.log(err);
          me.$vs.loading.close();
        });
    },
    getdir() {
      // this.tabRemision.remi_dir_partida=tr;
      this.tabRemision.remi_dir_partida=this.tabRemision.remi_idempresa.direccion;
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
    getRemision() {
      let me = this;
      me.$vs.loading();

      this.$http
        .get(this.$server_url + "GetRemision")
        .then((res) => {
          this.Remision = res.data;

          me.$vs.loading.close();
        })
        .catch((err) => {
          console.log(err);
          me.$vs.loading.close();
        });
    },
    getRemisionParametro() {
      let me = this;

      if (me.busquedaxcodigo.length < 2) {
        me.$vs.notify({
          text: "Minimo 2 caracteres de busqueda",
          color: "warning",
          iconPack: "feather",
          icon: "icon-check",
        });
        return false;
      }
      me.$vs.loading();

      this.$http
        .get(
          this.$server_url +
            "GetRemision_xfiltro?busqueda=" +
            me.busqueda +
            "&razonbusqueda=" +
            me.busquedaxcodigo
        )
        .then(function (res) {
          me.Remision = res.data;
          if (me.Remision.length === 0) {
            me.$vs.notify({
              text: "No hay remisiones para esta búsqueda",
              color: "danger",
              iconPack: "feather",
              icon: "icon-x",
            });
            me.Remision = [];
            me.$vs.loading.close();
          } else {
            me.$vs.loading.close();
            if (res.data.message) {
              me.$vs.notify({
                text: res.data.message,
                color: "success",
                iconPack: "feather",
                icon: "icon-user",
              });
            }
          }
        })
        .catch(function (error) {
          if (error.response && error.response.status === 404) {
            me.$vs.notify({
              text: "No hay remisiones para esta búsqueda",
              color: "danger",
              iconPack: "feather",
              icon: "icon-x",
            });
            me.Remision = [];
            me.$vs.loading.close();
          } else {
            console.log(error + " error");
            me.$vs.loading.close();
          }
        });
    },
    getNuevo() {
      this.searchData();
      this.searchData1();
      this.getEmpresas();
      this.popupActivoGuardar = true;
      this.tabRemision.remi_num_factura = "";
      this.tabRemision.remi_idempresa="";
      this.tabRemision.remi_dir_partida="";
      this.tabRemision.remi_motivo = "";
      this.tabRemision.remi_destinatario = "";
      this.tabRemision.remi_ruc_destinatario = "";
      this.tabRemision.remi_direccion = "";
      this.tabRemision.remi_nombre_transportista = "";
      this.tabRemision.remi_ci_transportista = "";
      this.tabRemision.remi_detalle = "";
      this.tabRemision.remi_cantidad = "";
      this.tabRemision.remi_unidad_medida = "";
      this.tabRemision.trans_codigo = "";
      this.tabRemision.remi_guia_remision = "";
      this.tabRemision.remi_obs = "";
      this.tabRemision.remi_paquete = "";
      this.tabRemision.remi_funda = "";
      this.tabRemision.remi_rollo = "";
      this.remi_flete = false;
      this.remi_pagado = false;
    },
    guardarnuevo() {
      let me = this;
      me.fecha = me.mostrarFechayhora();
      const usuariorespo = localStorage.getItem("usuario");
      const usuarioObjeto = JSON.parse(usuariorespo);
      const nombre = usuarioObjeto.nombres;
      const apellido = usuarioObjeto.apellidos;
      var usa = nombre + " " + apellido;
      var fle = "";
      var pag = "";
      if (this.remi_flete == true) {
        fle = 1;
      } else {
        fle = 0;
      }
      if (this.remi_pagado == true) {
        pag = 1;
      } else {
        pag = 0;
      }

      let datos = {
        remi_motivo: parseInt(this.tabRemision.remi_motivo.mot_id),
        remi_dir_partida: this.tabRemision.remi_dir_partida,
        remi_destinatario: this.tabRemision.remi_destinatario,
        remi_ruc_destinatario: this.tabRemision.remi_ruc_destinatario,
        remi_direccion: this.tabRemision.remi_direccion,
        remi_nombre_transportista: this.tabRemision.remi_nombre_transportista,
        remi_ci_transportista: this.tabRemision.remi_ci_transportista,
        remi_detalle: this.tabRemision.remi_detalle.value,
        remi_cantidad: parseInt(this.tabRemision.remi_cantidad),
        remi_unidad_medida: this.tabRemision.remi_unidad_medida.value,
        remi_num_factura: this.tabRemision.remi_num_factura,
        remi_fecha_inicio: this.fecha,
        trans_codigo: parseInt(this.tabRemision.trans_codigo.trans_codigo),
        remi_guia_remision: this.tabRemision.remi_guia_remision,
        remi_obs: this.tabRemision.remi_obs,
        remi_responsable: usa,
        remi_paquete: parseInt(this.tabRemision.remi_paquete),
        remi_funda: parseInt(this.tabRemision.remi_funda),
        remi_rollo: parseInt(this.tabRemision.remi_rollo),
        remi_flete: fle,
        remi_pagado: pag,
        remi_idempresa: this.tabRemision.remi_idempresa,
        user_created: usuarioObjeto.idusuario,
      };
      me.$vs.loading();
      this.$http
        .post(this.$server_url + "PostRemision_Registrar_modificar", datos)
        .then((res) => {
          me.$vs.loading.close();
          this.getRemision();
          me.$vs.notify({
            text: "La remisión se guardó con éxito",
            color: "success",
            iconPack: "feather",
            icon: "icon-check",
          });
          this.popupActivoEditar = false;
          this.popupActivoDesactivar = false;
          this.popupActivoGuardar = false;
          this.popupActivoEliminar = false;
        })
        .catch(function () {
          me.$vs.loading.close();
          me.$vs.notify({
            text: "La remisión no se pudo guardar",
            color: "danger",
            iconPack: "feather",
            icon: "icon-x",
          });
        });
    },

    getEditar(tr) {
      this.searchData();
      this.searchData1();
      this.popupActivoEditar = true;
      this.tabRemision.remi_num_factura = tr.remi_num_factura;
      this.tabRemision.remi_codigo = tr.remi_codigo;
      this.tabRemision.remi_dir_partida = tr.remi_dir_partida;
      this.tabRemision.remi_destinatario = tr.remi_destinatario;
      this.tabRemision.remi_ruc_destinatario = tr.remi_ruc_destinatario;
      this.tabRemision.remi_direccion = tr.remi_direccion;
      this.tabRemision.remi_nombre_transportista = tr.remi_nombre_transportista;
      this.tabRemision.remi_ci_transportista = tr.remi_ci_transportista;
      this.tabRemision.remi_detalle = tr.remi_detalle;
      this.tabRemision.remi_cantidad = tr.remi_cantidad;
      this.tabRemision.remi_unidad_medida = {text:tr.remi_unidad_medida, value:tr.remi_unidad_medida};
      this.tabRemision.remi_guia_remision = tr.remi_guia_remision;
      this.tabRemision.remi_obs = tr.remi_obs;
      this.tabRemision.remi_paquete = tr.remi_paquete;
      this.tabRemision.remi_funda = tr.remi_funda;
      this.tabRemision.remi_rollo = tr.remi_rollo;
      this.tabRemision.remi_detalle= {text:tr.remi_detalle, value:tr.remi_detalle};
      this.tabRemision.remi_motivo ={mot_id:tr.mot_id, mot_nombre:tr.mot_nombre};
      this.tabRemision.trans_codigo ={trans_codig:tr.trans_codig, trans_nombre:tr.trans_nombre};
      if (tr.remi_flete == 1) {
        this.remi_flete = true;
      } else {
        this.remi_flete = false;
      }
      if (tr.remi_pagado == 1) {
        this.remi_pagado = true;
      } else {
        this.remi_pagado = false;
      }
    },
    getEmpresas() {
            let me = this;
            me.listaEmpresas = []
            me.$vs.loading();
            this.$http.get(this.$server_url + 'empresa')
                .then(res => {
                    // console.log(res.data)
                    me.listaEmpresas = res.data;
                    me.$vs.loading.close();
                })
                .catch(err => {
                    console.log(err)
                    me.$vs.loading.close();
                })
        },
    editar() {
      let me = this;
      me.fecha = me.mostrarFechayhora();
      const usuariorespo = localStorage.getItem("usuario");
      const usuarioObjeto = JSON.parse(usuariorespo);
      const nombre = usuarioObjeto.nombres;
      const apellido = usuarioObjeto.apellidos;
      var usa = nombre + " " + apellido;
      var fle = "";
      var pag = "";
      if (this.remi_flete == true) {
        fle = 1;
      } else {
        fle = 0;
      }
      if (this.remi_pagado == true) {
        pag = 1;
      } else {
        pag = 0;
      }

      if (
        (this.tabRemision.bod_nombre === "" || this.tabRemision.bod_nombre === null) &&
        (this.tabRemision.bod_ubicacion === "" || this.tabRemision.bod_ubicacion === null)
      ) {
        me.$vs.notify({
          text: "Escriba los datos de la remisión antes de editar",
          color: "danger",
          iconPack: "feather",
          icon: "icon-alert-triangle",
        });
        return;
      }
      let datos = {
        remi_codigo: this.tabRemision.remi_codigo,
        remi_motivo: this.id_moti,
        remi_dir_partida: this.tabRemision.remi_dir_partida,
        remi_destinatario: this.tabRemision.remi_destinatario,
        remi_ruc_destinatario: this.tabRemision.remi_ruc_destinatario,
        remi_direccion: this.tabRemision.remi_direccion,
        remi_nombre_transportista: this.tabRemision.remi_nombre_transportista,
        remi_ci_transportista: this.tabRemision.remi_ci_transportista,
        remi_detalle: this.tabRemision.remi_detalle,
        remi_cantidad: this.tabRemision.remi_cantidad,
        remi_unidad_medida: this.tabRemision.remi_unidad_medida,
        trans_codigo: this.id_trans,
        remi_guia_remision: this.tabRemision.remi_guia_remision,
        remi_obs: this.tabRemision.remi_obs,
        remi_paquete: this.tabRemision.remi_paquete,
        remi_funda: this.tabRemision.remi_funda,
        remi_rollo: this.tabRemision.remi_rollo,
        remi_flete: fle,
        remi_pagado: pag,
      };
      me.$vs.loading();
      this.$http
        .post(this.$server_url + "PostRemision_Registrar_modificar", datos)
        .then((res) => {
          me.$vs.loading.close();
          this.getRemision();
          me.$vs.notify({
            text: "Remisión editada con exito",
            color: "success",
            iconPack: "feather",
            icon: "icon-check",
          });
          this.popupActivoEditar = false;
          this.popupActivoDesactivar = false;
          this.popupActivoGuardar = false;
          this.popupActivoEliminar = false;
        })
        .catch((error) => {
          console.log(error);
          me.$vs.loading.close();
          me.$vs.notify({
            text: "Remisión no se pudo editar",
            color: "danger",
            iconPack: "feather",
            icon: "icon-x",
          });
        });
    },

    getCancelar() {
      this.popupActivoEditar = false;
      this.popupActivoGuardar = false;
      this.popupActivoEliminar = false;
      this.popupActivoDesactivar = false;
    },

    getPreguntaEliminar(tr) {
      this.popupActivoEliminar = true;
      this.tabRemision.remi_codigo = tr.remi_codigo;
    },

    getEliminar() {
      let me = this;
      let datos = {
        remi_codigo: this.tabRemision.remi_codigo,
      };
      me.$vs.loading();
      this.$http
        .post(this.$server_url + "Eliminar_Remision", datos)
        .then((res) => {
          me.$vs.loading.close();
          this.getRemision();

          me.$vs.notify({
            text: "Remisión eliminada con exito",
            color: "success",
            iconPack: "feather",
            icon: "icon-check",
          });

          this.popupActivoEditar = false;
          this.popupActivoDesactivar = false;
          this.popupActivoGuardar = false;
          this.popupActivoEliminar = false;
        })
        .catch(function (error) {
          console.log(error);
          me.$vs.loading.close();
          me.$vs.notify({
            text: "Remisión no se pudo eliminar",
            color: "danger",
            iconPack: "feather",
            icon: "icon-x",
          });
        });
    },
  },
};
</script>
