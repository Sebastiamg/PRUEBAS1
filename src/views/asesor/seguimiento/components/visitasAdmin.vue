<template>
    <div>
     <vs-row>
    
        <p @click="popupAgregarSeguimiento = true;update = false;" style="cursor:pointer" v-if="usuario.id_group == 1">
            <vs-chip color="primary" style="cursor:pointer"  class="mt-2">
                <vs-avatar icon="edit"  @click="popupAgregarSeguimiento = true;limpiar()"/>
                Agregar {{valor}}
            </vs-chip>
        </p>    
      
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
             <vs-table stripe :data="visitas" search pagination max-items="10" style="width: 100%;">
                <template slot="header">
                    
                    <vs-list>
                        <vs-list-header title="Información"></vs-list-header>
                        <vs-list-item title="Institución" :subtitle="institucion"></vs-list-item>
                        <vs-list-item title="Período" :subtitle="periodo"></vs-list-item>
                        <vs-list-item :title="valor +' ' + 'cantidad'" :subtitle="visitas.length"></vs-list-item>
                    </vs-list>

                </template>
                
                <template slot="thead">
                    <vs-th>
                       
                    {{valor}}
                    </vs-th>
                    <vs-th>
                        
                    Fecha Genera {{valor}}
                    </vs-th>
                    <vs-th>
                    Fecha {{valor}}
                    </vs-th>
                    <vs-th>
                    Observación
                    </vs-th>
                    <vs-th>
                    Estado
                    </vs-th>
                    <vs-th>
                    Acciones
                    </vs-th>

                </template>
            
                <template slot-scope="{data}">
                    <vs-tr :key="indextr" v-for="(tr, indextr) in data" >
                        <vs-td :data="data[indextr].num_visita" width="20%">
                            <vs-chip color="primary">
                            {{valor}} Nº {{data[indextr].num_visita}}
                            </vs-chip>
                        </vs-td>
                        <vs-td :data="data[indextr].fecha_genera_visita" width="20%">
                            {{data[indextr].fecha_genera_visita}}
                        </vs-td>

                        <vs-td :data="data[indextr].fecha_que_visita" width="20%">
                            {{data[indextr].fecha_que_visita}}
                        </vs-td>

                        <vs-td height="30%" width="50%">
                            <div class="overflow-y-auto h-24">
                                {{tr.observacion}}
                               
                            </div>
                        </vs-td>
                        <vs-td>
                            <vs-chip :color="tr.estado == '0'?'success':'warning'">
                                {{ tr.estado == '0' ? 'Generada' :'Finalizada' }}
                            </vs-chip>
                        </vs-td>
                        <vs-td>
                            <div style="display:flex;">
                                <vx-tooltip style="display: inline-block;" text="Editar" position="top" color="primary">
                                    <vs-button radius color="success" @click="openModalEdit(tr);update = true" type="line" icon="edit"></vs-button>
                                </vx-tooltip> &nbsp;  
                                <vx-tooltip style="display: inline-block;" :text="'Eliminar '+valor" position="top" color="danger">
                                    <vs-button radius color="danger" @click="openConfirm(tr)" type="line" icon="delete"></vs-button>
                                </vx-tooltip> &nbsp;  
                            </div>
                         
             
                        </vs-td>
                    </vs-tr>
                </template>
            </vs-table>
        </vs-col>
    </vs-row>

    <vs-card>
         <vs-collapse accordion>
        <vs-collapse-item>
            <div slot="header">
                Registros Pendientes con Instituciones de Prolipa
            </div>
            <div>
                <vs-table max-items="10" stripe search pagination :data="institucionesProlipa" class="mt-2">
                    <template slot="thead">
                        <vs-th>Datos Planificación</vs-th>
                        <vs-th>Opciones</vs-th>
                        <vs-th>Prioridad</vs-th>
                        <vs-th>Observación</vs-th>
                        <vs-th>Acciones</vs-th>
                    </template>
                    <template slot-scope="{data}">
                        <vs-tr :key="indextr" v-for="(tr, indextr) in data">

                            <vs-td>
                                Titulo:
                                <br>
                                <span style="font-weight:600;">
                                   
                                    {{ tr.title }}<br>
                                </span>

                                Fecha inicio:
                                <br>
                                <span style=" font-weight:600; ">
                                    {{ tr.startDate }}<br>
                                </span>

                                Fecha Fin:
                                <br>
                                <span style="font-weight:600;  ">
                                    {{ tr.endDate }}<br>
                                </span>
                                Institución:
                                <br>
                                <span style="font-weight:600;  ">
                                    {{ tr.nombreInstitucion }}<br>
                                </span>
                            </vs-td>
                            <vs-td height="30%" width="50%">
                                <div class="overflow-y-auto h-24">
                                    <vs-chip color="primary" v-if="tr.opciones.presentacion">
                                        Presentación
                                    </vs-chip>
                                    <vs-chip color="primary" v-if="tr.opciones.entrega_muestras">
                                        Entrega muestras
                                    </vs-chip>
                                    <vs-chip color="primary" v-if="tr.opciones.reunion">
                                        Reunión
                                    </vs-chip>
                                    <vs-chip color="primary" v-if="tr.opciones.seguimiento">
                                        Seguimiento
                                    </vs-chip>
                                    <vs-chip color="primary" v-if="tr.opciones.cierre">
                                        Cierre
                                    </vs-chip>
                                    <vs-chip color="primary" v-if="tr.opciones.cobranza">
                                        Cobranza
                                    </vs-chip>
                                    <vs-chip color="primary" v-if="tr.opciones.post_venta">
                                        Post venta
                                    </vs-chip>
                                    <vs-chip color="primary" v-if="tr.opciones.retiro_cartas">
                                        Retiro cartas
                                    </vs-chip>
                                    <vs-chip color="primary" v-if="tr.opciones.retiro_muestras">
                                        Retiro muestras
                                    </vs-chip>
                                </div>
                            </vs-td>
                            <vs-td>
                                <vs-chip color="success">
                                    {{tr.label}}
                                </vs-chip>
                            </vs-td>
                            <vs-td>
                                {{tr.url}}
                            </vs-td>
                            <vs-td>
                                <div style="display: flex;">
                                     <vx-tooltip style="display: inline-block;" text="Registrar Planificación" position="top" color="warning">
                                        <vs-button class="modal-default-button"  @click="ModalPendientes(tr,0)" radius size="small" color="primary" type="line" icon-pack="feather" icon="icon-bookmark">
                                        </vs-button>
                                    </vx-tooltip> &nbsp;
                                    <vx-tooltip style="display: inline-block;" text="Marcar como registrado" position="top" color="primary">
                                        <vs-button class="modal-default-button" radius @click="confirmarRegistroPendiente(tr)" size="small" color="success" type="line" icon-pack="feather" icon="icon-check-circle">
                                        </vs-button>
                                    </vx-tooltip> &nbsp;
                                </div>
                            </vs-td>

                        </vs-tr>
                    </template>
                </vs-table>
            </div>
        </vs-collapse-item>
        <vs-collapse-item>
            <div slot="header">
                Registros Pendientes con Instituciones Nuevas
            </div>
            <div>
         
                <vs-table max-items="10" stripe search pagination :data="institucionesTemporales" class="mt-2">
                    <template slot="thead">
                        <vs-th>Datos Planificación</vs-th>
                        <vs-th>Opciones</vs-th>
                        <vs-th>Prioridad</vs-th>
                        <vs-th>Observación</vs-th>
                        <vs-th>Acciones</vs-th>
                    </template>
                    <template slot-scope="{data}">
                        <vs-tr :key="indextr" v-for="(tr, indextr) in data">

                            <vs-td>
                               
                                Titulo:
                                <br>
                                <span style="font-weight:600;  ">
                                    {{ tr.title }}<br>
                                </span>

                                Fecha inicio:
                                <br>
                                <span style=" font-weight:600; ">
                                    {{ tr.startDate }}<br>
                                </span>

                                Fecha Fin:
                                <br>
                                <span style="font-weight:600;  ">
                                    {{ tr.endDate }}<br>
                                </span>
                                Institución:
                                <br>
                                <span style="font-weight:600;  ">
                                    {{ tr.nombre_institucion_temporal }}<br>
                                </span>
                            </vs-td>
                             <vs-td height="30%" width="50%">
                                <div class="overflow-y-auto h-24">
                                    <vs-chip color="primary" v-if="tr.opciones.presentacion">
                                        Presentación
                                    </vs-chip>
                                    <vs-chip color="primary" v-if="tr.opciones.entrega_muestras">
                                        Entrega muestras
                                    </vs-chip>
                                    <vs-chip color="primary" v-if="tr.opciones.reunion">
                                        Reunión
                                    </vs-chip>
                                    <vs-chip color="primary" v-if="tr.opciones.seguimiento">
                                        Seguimiento
                                    </vs-chip>
                                    <vs-chip color="primary" v-if="tr.opciones.cierre">
                                        Cierre
                                    </vs-chip>
                                    <vs-chip color="primary" v-if="tr.opciones.cobranza">
                                        Cobranza
                                    </vs-chip>
                                    <vs-chip color="primary" v-if="tr.opciones.post_venta">
                                        Post venta
                                    </vs-chip>
                                    <vs-chip color="primary" v-if="tr.opciones.retiro_cartas">
                                        Retiro cartas
                                    </vs-chip>
                                    <vs-chip color="primary" v-if="tr.opciones.retiro_muestras">
                                        Retiro muestras
                                    </vs-chip>
                                </div>
                            </vs-td>
                            <vs-td>
                                <vs-chip color="success">
                                    {{tr.label}}
                                </vs-chip>
                            </vs-td>
                            <vs-td>
                                {{tr.url}}
                            </vs-td>
                            <vs-td>
                                <div style="display: flex;">
                                     <vx-tooltip style="display: inline-block;" text="Registrar Planificación" position="top" color="warning">
                                        <vs-button class="modal-default-button"  @click="ModalPendientes(tr,1)" radius size="small" color="primary" type="line" icon-pack="feather" icon="icon-bookmark">
                                        </vs-button>
                                    </vx-tooltip> &nbsp;
                                    <vx-tooltip style="display: inline-block;" text="Marcar como registrado" position="top" color="primary">
                                        <vs-button class="modal-default-button" radius @click="confirmarRegistroPendiente(tr)" size="small" color="success" type="line" icon-pack="feather" icon="icon-check-circle">
                                        </vs-button>
                                    </vx-tooltip> &nbsp;
                                </div>
                            </vs-td>

                        </vs-tr>
                    </template>
                </vs-table>
            </div>

        </vs-collapse-item>

    </vs-collapse>
    </vs-card>

    
    <!--MODALES-->
    <!--MODAL PARA AGREGAR SEGUIMIENTO-->
    <!-- <vs-popup
        :title="title" :active.sync="popupAgregarSeguimiento">

            <vs-row>
                <p class="ml-2">Fecha generar {{valor}}</p>
                <vs-col  class="mt-1" vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                   <flat-pickr :config="configdateTimePicker" v-model="Fgenerar"  :placeholder="titleFechaGenera" class="m-1" style="display: inline-block;width: 100%;" />
                </vs-col>
            </vs-row>
            <vs-row class="mt-2">    
                <p class="ml-2">Observación</p>
                <vs-col  class="mt-1" vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
            
                <vs-textarea counter="500" style="width:100%;" label="Mensaje" :counter-danger.sync="counterDanger" v-model="seguimiento.observacion" />
                </vs-col>
            </vs-row>
            <vs-row>
                <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                    <vs-button @click="generarSeguimiento()" type="gradient">Generar {{valor}}</vs-button>
                </vs-col>
            </vs-row>
        
    </vs-popup> -->

    <!--MODAL PARA Editar SEGUIMIENTO-->
    <!-- <vs-popup
         :title="title" :active.sync="popupEditarSeguimiento">

            <vs-row>
                <p class="ml-2">Fecha generar {{valor}}</p>
                <vs-col  class="mt-1" vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                   <flat-pickr :config="configdateTimePicker" v-model="Fgenerar"  :placeholder="titleFechaGenera" class="m-1" style="display: inline-block;width: 100%;" />
                </vs-col>
            </vs-row>
             <vs-row>
                <p class="ml-2">Fecha de la {{valor}}</p>
                <vs-col  class="mt-1" vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                   <flat-pickr :config="configdateTimePicker" v-model="Fvisita"  :placeholder="titleFechaVisita" class="m-1" style="display: inline-block;width: 100%;" />
                </vs-col>
            </vs-row>
            <vs-row class="mt-2">    
                <p class="ml-2">Observación</p>
                <vs-col  class="mt-1" vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                <vs-textarea counter="500" style="width:100%;" label="Mensaje" :counter-danger.sync="counterDanger" v-model="seguimiento.observacion" />
                </vs-col>
            </vs-row>
            <vs-row>
                <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                    <vs-button @click="generarSeguimiento()" type="gradient">Generar {{valor}}</vs-button>
                </vs-col>
            </vs-row>
        
    </vs-popup> -->
         <!--MODALES-->
    <!--MODAL PARA AGREGAR SEGUIMIENTO-->
    <vs-popup :title="title" :active.sync="popupAgregarSeguimiento">

            <vs-row v-if="seleccionadoInsitucion ==  false" class="mt-2">
                <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                    <p style="color:red;" v-if="nombreInstitucion == '' || nombreInstitucion == null ">
                        Sin Institución
                    </p>
                    <vs-chip color="success" v-else>
                        Institución {{ nombreInstitucion}}
                    </vs-chip>
                </vs-col>
            </vs-row>
            <vs-row v-if="seleccionadoInsitucion ==  true" class="mt-2">
                <vs-col vs-type="flex" vs-justify="left" vs-align="left" vs-w="6">
                    <vs-button size="small" color="success" radius="" @click="regresar()" icon="reply" type="gradient"></vs-button>
                    <vs-button size="small" class="ml-3" @click="popupAddNuevaInstitucion = true;activePromptAddEvent = false;" type="relief">Añadir nueva institución</vs-button>
                </vs-col>

            </vs-row>

            <vs-button color="warning" class="mt-2" v-if="seleccionadoInsitucion == false" size="small" style="margin:0 auto;" @click="seleccionadoInsitucion = true;" type="relief">Asignar Institución</vs-button>
            <div style="width:100%;display:flex;" v-if="seleccionadoInsitucion ==  true" class="mt-5">
                <div style="width:80%;">
                    <vs-input icon="search" style="width:100%;" placeholder="Search" @keyup.enter="getInstitucion()" v-model="busquedaInstitucion" />
                </div>

                <div style="width:20%;margin-left:15px;">
                    <vs-button radius color="warning" @click="getInstitucion()" type="filled" icon="search"></vs-button>
                </div>
            </div>


            <div v-if="instituciones.length >0">
                <vs-table stripe max-items="5" search pagination :data="instituciones">
                    <template slot="header">
                        <div class="vx-row">
                            <div class="vx-col w-full m-3">
                                Cantidad: {{instituciones.length}}
                            </div>

                        </div>
                    </template>
                    <template slot="thead">
                        <vs-th sort-key="nombreInstitucion">Institución</vs-th>
                        <vs-th sort-key="nombre">Localidad</vs-th>
                        <vs-th>Acciones</vs-th>
                    </template>
                    <template slot-scope="{data}">
                        <vs-tr :key="indextr" v-for="(tr, indextr) in data">

                            <vs-td :data="data[indextr].nombreInstitucion">
                                {{data[indextr].nombreInstitucion}}<br>

                            </vs-td>
                            <vs-td :data="data[indextr].nombreregion">
                                {{data[indextr].nombreregion}} <br>
                                <small>{{data[indextr].ciudad}}</small>
                            </vs-td>
                            <vs-td>
                                <div class="flex">
                                    <vs-button size="small" type="relief" style="border-radius: 5px;" icon-pack="feather" icon="icon-bookmark" class="mr-2" color="primary" @click="asginarInstitucion(tr);error=false">
                                        Asignar
                                    </vs-button>
                                </div>
                            </vs-td>
                        </vs-tr>
                    </template>
                </vs-table>
            </div>
            <vs-row v-if="error ==  true" class="mt-3">
                    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                        <vs-alert active="true" color="danger">
                            {{messageError}}
                        </vs-alert>
                    </vs-col>
            </vs-row>

        <div v-if="seleccionadoInsitucion == false">
             <vs-row class="mt-4">
                <p class="ml-2">Fecha generar {{valor}}</p>
                <vs-col class="mt-1" vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                    <flat-pickr :config="configdateTimePicker" v-model="Fgenerar" :placeholder="titleFechaGenera" class="m-1" style="display: inline-block;width: 100%;" />
                </vs-col>
            </vs-row>
            <vs-row class="mt-2">
                <p class="ml-2">Observación</p>
                <vs-col class="mt-1" vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">

                    <vs-textarea counter="500" style="width:100%;" label="Mensaje" :counter-danger.sync="counterDanger" v-model="seguimiento.observacion" />
                </vs-col>
            </vs-row>
            <vs-divider color="success">Opciones</vs-divider>
        

            <vs-row class="mt-5">
                <ul style="display:flex;flex-wrap: wrap;width: 100%;">
                <li style="width: 50%;">
                    <vs-checkbox  color="success" v-model="opciones.presentacion">Presentación</vs-checkbox>
                </li>
                <li style="width: 50%;">
                    <vs-checkbox color="success" v-model="opciones.entrega_muestras">Entregas de muestras</vs-checkbox>
                </li>
                <li style="width: 50%;margin-top: 5px;">
                    <vs-checkbox color="success" v-model="opciones.reunion">Reunión</vs-checkbox>
                </li>
                <li style="width: 50%;margin-top: 10px;">
                    <vs-checkbox color="success" v-model="opciones.seguimiento">Seguimiento</vs-checkbox>
                </li>
                <li style="width: 50%;margin-top: 10px;">
                    <vs-checkbox color="success" v-model="opciones.cierre">Cierre</vs-checkbox>
                </li>
                <li style="width: 50%;margin-top: 10px;">
                    <vs-checkbox color="success" v-model="opciones.cobranza">Cobranza</vs-checkbox>
                </li>
                <li style="width: 50%;margin-top: 10px;">
                    <vs-checkbox color="success" v-model="opciones.post_venta">Post Venta</vs-checkbox>
                </li>
                <li style="width: 50%;margin-top: 10px;">
                    <vs-checkbox color="success" v-model="opciones.retiro_cartas">Retiro de cartas</vs-checkbox>
                </li>
                <li style="width: 50%;margin-top: 10px;">
                    <vs-checkbox color="success" v-model="opciones.retiro_muestras">Retiro de muestra</vs-checkbox>
                </li>

                <li style="width: 30%;margin-top: 10px;">
                    <vs-switch color="danger" v-model="opciones.sinSello" style="width: 60%;">
                            <span slot="on">Sin sello</span>
                            <span slot="off">Con Sello</span>
                    </vs-switch>
                </li>
                <li style="width: 50%;margin-top: 10px;">
                    <vs-checkbox color="success" v-model="opciones.otraEditorial">Otra Editorial</vs-checkbox>
                </li>
                <li  v-if="opciones.otraEditorial == true" style="width: 50%;margin-top: 10px;">
                    <vs-input class="inputx" style="width: 90%;" placeholder="Escriba el nombre de la editorial" v-model="opciones.editorial" />

                </li>
                </ul> 
            </vs-row>

            <vs-row class="mt-5">
                <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                    <vs-button @click="generarSeguimiento()" type="gradient">Generar {{valor}}</vs-button>
                </vs-col>
            </vs-row>
        </div>

           

    </vs-popup>

    <!--MODAL PARA Editar SEGUIMIENTO-->
    <vs-popup :title="title" :active.sync="popupEditarSeguimiento">

        
     

        <vs-row>
            <p class="ml-2">Fecha generar {{valor}}</p>
            <vs-col class="mt-1" vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                <flat-pickr :config="configdateTimePicker" v-model="Fgenerar" :placeholder="titleFechaGenera" class="m-1" style="display: inline-block;width: 100%;" />
            </vs-col>
        </vs-row>
        <vs-row>
            <p class="ml-2">Fecha de la {{valor}}</p>
            <vs-col class="mt-1" vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                <flat-pickr :config="configdateTimePicker" v-model="Fvisita" :placeholder="titleFechaVisita" class="m-1" style="display: inline-block;width: 100%;" />
            </vs-col>
        </vs-row>
        <vs-row class="mt-2">
            <p class="ml-2">Observación</p>
            <vs-col class="mt-1" vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                <vs-textarea counter="500" style="width:100%;" label="Mensaje" :counter-danger.sync="counterDanger" v-model="seguimiento.observacion" />
            </vs-col>
        </vs-row>
        <vs-divider color="success">Opciones</vs-divider>

        <vs-row class="mt-5">
            <ul style="display:flex;flex-wrap: wrap;width: 100%;">
              <li style="width: 50%;">
                <vs-checkbox  color="success" v-model="opciones.presentacion">Presentación</vs-checkbox>
              </li>
              <li style="width: 50%;">
                <vs-checkbox color="success" v-model="opciones.entrega_muestras">Entregas de muestras</vs-checkbox>
              </li>
              <li style="width: 50%;margin-top: 5px;">
                <vs-checkbox color="success" v-model="opciones.reunion">Reunión</vs-checkbox>
              </li>
              <li style="width: 50%;margin-top: 10px;">
                <vs-checkbox color="success" v-model="opciones.seguimiento">Seguimiento</vs-checkbox>
              </li>
              <li style="width: 50%;margin-top: 10px;">
                <vs-checkbox color="success" v-model="opciones.cierre">Cierre</vs-checkbox>
              </li>
              <li style="width: 50%;margin-top: 10px;">
                <vs-checkbox color="success" v-model="opciones.cobranza">Cobranza</vs-checkbox>
              </li>
              <li style="width: 50%;margin-top: 10px;">
                <vs-checkbox color="success" v-model="opciones.post_venta">Post Venta</vs-checkbox>
              </li>
              <li style="width: 50%;margin-top: 10px;">
                <vs-checkbox color="success" v-model="opciones.retiro_cartas">Retiro de cartas</vs-checkbox>
              </li>
              <li style="width: 50%;margin-top: 10px;">
                <vs-checkbox color="success" v-model="opciones.retiro_muestras">Retiro de muestra</vs-checkbox>
              </li>

             <li style="width: 30%;margin-top: 10px;">
                <vs-switch color="danger" v-model="opciones.sinSello" style="width: 60%;">
                        <span slot="on">Sin sello</span>
                        <span slot="off">Con Sello</span>
                  </vs-switch>
              </li>
              <li style="width: 50%;margin-top: 10px;">
                <vs-checkbox color="success" v-model="opciones.otraEditorial">Otra Editorial</vs-checkbox>
              </li>
               <li  v-if="opciones.otraEditorial == true" style="width: 50%;margin-top: 10px;">
                  <vs-input class="inputx" style="width: 90%;" placeholder="Escriba el nombre de la editorial" v-model="opciones.editorial" />

               </li>

            </ul> 
        </vs-row>
        <vs-row>
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                <vs-button @click="generarSeguimiento()" type="gradient">Generar {{valor}}</vs-button>
            </vs-col>
        </vs-row>

    </vs-popup>

       <!--MODAL PARA AGREGAR NUEVA INSTITUCION-->

        <vs-popup background-color="rgba(255,255,255,.6)" title="Agregar Nueva Institución" :active.sync="popupAddNuevaInstitucion">
            <vs-button size="small" color="success" radius="" @click="popupAddNuevaInstitucion=false;activePromptAddEvent=true;" icon="reply" type="gradient"></vs-button>
            <vs-row>
                <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                    <div class="vx-col w-full mt-5">

                        Seleccione una ciudad:
                        <v-select :options="arregloCiudad" :reduce="arregloCiudad => arregloCiudad" label="nombre" class="w-full" v-model="temporalInstitucion.ciudad" />
                    </div>
                </vs-col>
            </vs-row>
            <vs-row class="mt-2">
                <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                    <vs-input label="Escriba un nombre para la institución" class="w-full" v-model="temporalInstitucion.nombre_institucion" placeholder="Institución" />
                </vs-col>
            </vs-row>

            <vs-row class="mt-2">
                <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                    <ul class="leftx" style="display:flex;flex-direction: row;">

                        <li class="ml-2">
                            <vs-radio v-model="temporalInstitucion.region" vs-name="radios1" vs-value="1">Sierra</vs-radio>
                        </li>
                        <li class="ml-2">
                            <vs-radio v-model="temporalInstitucion.region" vs-name="radios1" vs-value="2">Costa</vs-radio>
                        </li>

                    </ul>
                </vs-col>
            </vs-row>

            <vs-row class="mt-5">
                <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                    <vs-button @click="agregarInstitucionTemporal();error = false" type="gradient">Agregar Institución</vs-button>
                </vs-col>
            </vs-row>
        </vs-popup>
    </div>
</template>

<script>
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
export default {
    data() {
       return{
           counterDanger: false,
           visitas:[],
           institucion:'',
           institucion_id:'',
           periodo:'',
           periodo_id:'',
           usuario:[],
           popupAgregarSeguimiento:false,
           popupEditarSeguimiento:false,
            Fgenerar: null,
            Fvisita: null,
            configdateTimePicker: {
                enableTime: true,
                dateFormat: 'Y-m-d'
            },
            seguimiento:{
                observacion:''
            },
            id:0,
            update:false,
            title:'',
            titleFechaGenera:'',
            titleFechaVisita:'',
            isAdmin:'',
            asesorDesdeAdmin:'',
            institucionesProlipa:[],
            institucionesTemporales:[],
            asesor_id:'',
               opciones:{
                presentacion:false,
                entrega_muestras:false,
                reunion:false,
                seguimiento:false,
                cierre:false,
                cobranza:false,
                post_venta:false,
                retiro_cartas:false,
                retiro_muestras:false,
                sinSello: true,
                editorial: '',
                otraEditorial: false,
            },
            nombreInstitucion:'',
            estado_institucion_temporal:'0',
            institucion_id_temporal:'',
        
            popupFiltroInstitucion:false,
            error: false,
            messageError: "",
            ciudadSelect: '',
            popupAddNuevaInstitucion: false,
            seleccionadoInsitucion: false,
            nombreInstitucion: '',
            busquedaInstitucion: "",
            instituciones: [],
            popupaddInstitucion: false,
            arregloCiudad: [],
            temporalInstitucion: {
                ciudad: '',
                nombreInstitucion: '',
                region: '2',
            },
          

       } 
    },
    props:{
        tipo:{
            type:String,
            default:1
        },
        valor:{
            type:String,
            default:"Visita"
        }
    },
      components:{
        flatPickr,
    },
    created(){
        let me = this;
         me.usuario = JSON.parse(localStorage.getItem("usuario"))
        me.institucion = localStorage.getItem("institucion_seguimiento_nombre")
        me.institucion_id = localStorage.getItem("institucion_seguimiento_id")
        me.periodo = localStorage.getItem("institucion_seguimiento_periodo")
        me.periodo_id = localStorage.getItem("institucion_seguimiento_periodo_id")
        me.isAdmin = localStorage.getItem("adminSeguimiento")
        me.asesor_id = localStorage.getItem("institucion_seguimiento_asesor_id")
        
        me.getVisitas()
        me.title = "Genera"+" " +me.valor
        me.titleFechaGenera = "Fecha generar"+ " " +me.valor
        me.titleFechaVisita = "Fecha visita" + " " +me.valor
        me.getRegistrosPendientes()
    }, 
    methods:{
        agregarInstitucionTemporal() {

            let me = this;
            if (me.temporalInstitucion.nombre_institucion == "" || me.temporalInstitucion.nombre_institucion == null || me.temporalInstitucion.nombre_institucion == undefined) {
                me.$vs.notify({
                    color: 'primary',
                    title: 'Mensaje',
                    text: 'Debe escribir una institución por favor'
                })
                return false;
            }

            let formData = new FormData();
            formData.append('nombre_institucion', me.temporalInstitucion.nombre_institucion);
            formData.append('ciudad', me.temporalInstitucion.ciudad.nombre);
            formData.append('region', me.temporalInstitucion.region);
            formData.append('asesor_id', me.usuario.idusuario);

            me.$vs.loading()
            this.$http.post(this.$server_url + 'GuardarInstitucionTemporal', formData)
                .then(res => {

                    me.$vs.loading.close()
                    me.popupAddNuevaInstitucion = false;
                    me.activePromptAddEvent = true
                    me.seleccionadoInsitucion = false;
                    me.nombreInstitucion = me.temporalInstitucion.nombre_institucion
                    me.institucion_id_temporal = res.data.institucion_temporal_id
                    me.instituciones = []
                    me.periodo_id_temporal = res.data.periodo_id
                    me.estado_institucion_temporal = 1;

                    me.$vs.notify({
                        text: "Se guardo correctamente",
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                })
        },
        //lista de ciudades para usar en el select
        listaCiudades() {
            let me = this
            this.$http.get(this.$server_url + `ciudad`).then(res => {
                    me.arregloCiudad = res.data;
                })
                .catch(function (error) {
                    console.log(error)
                })
        },
        regresar() {
            let me = this;
            me.seleccionadoInsitucion = false;
            me.instituciones = []
            me.error = false
        },
        limpiar(){
            let me = this;
            me.nombreInstitucion = "";
            me.opciones.presentacion     = "" 
            me.opciones.entrega_muestras = "" 
            me.opciones.reunion          = "" 
            me.opciones.seguimiento      = "" 
            me.opciones.cierre           = "" 
            me.opciones.cobranza         = "" 
            me.opciones.post_venta       = "" 
            me.opciones.retiro_cartas    = "" 
            me.opciones.retiro_muestras  = ""
            me.Fgenerar                  = "" 
            me.seguimiento.observacion   = "" 
            me.opciones.sinSello         = false;
            me.opciones.otraEditorial    = false;
            me.opciones.editorial        = ""

        },
        asginarInstitucion(tr) {
            let me = this;
            me.institucion_id = tr.idInstitucion
            me.nombreInstitucion = tr.nombreInstitucion
            me.estado_institucion_temporal = 0;
            me.seleccionadoInsitucion = false;
            me.instituciones = []

        },

        getInstitucion() {
            let me = this;
            me.instituciones = [];
            if (me.busquedaInstitucion.length < 5) {
                me.$vs.notify({
                    text: 'Minimo 5 caracteres de busqueda',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-check'
                })

                return false;

            }

            me.$vs.loading()
            this.$http.get(this.$server_url + 'listaInsitucionAsesor?busqueda=' + me.busquedaInstitucion + '&cedula=' + me.usuario.cedula)
                .then(function (res) {
                    // me.tmpInstituciones = res.data;
                    me.instituciones = res.data;
                    // me.filtroRegion();
                    me.$vs.loading.close()
                    if (res.data.message) {
                        me.$vs.notify({
                            text: res.data.message,
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-user',
                            time: 8000
                        })
                    }

                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()

                })
        },
         ModalPendientes(tr,tipo){
            let me = this

            if(tipo == 1){
                localStorage.setItem('institucion_seguimiento_id',tr.institucion_id_temporal)
                localStorage.setItem('institucion_seguimiento_nombre',tr.nombre_institucion_temporal) 
                me.estado_institucion_temporal = 1
                me.institucion_id_temporal = tr.institucion_id_temporal        
            }else{
                localStorage.setItem('institucion_seguimiento_id',tr.institucion_id)
                localStorage.setItem('institucion_seguimiento_nombre',tr.nombreInstitucion)   
                me.estado_institucion_temporal = 0   
                     
            }
            localStorage.setItem('institucion_seguimiento_periodo_id',tr.periodo_id)
            localStorage.setItem('institucion_seguimiento_periodo',tr.periodo)
            me.nombreInstitucion = localStorage.getItem("institucion_seguimiento_nombre")
            me.institucion = localStorage.getItem("institucion_seguimiento_nombre")
            me.institucion_id = localStorage.getItem("institucion_seguimiento_id")
            me.periodo = localStorage.getItem("institucion_seguimiento_periodo")
            me.periodo_id = localStorage.getItem("institucion_seguimiento_periodo_id")
            //abrir modal 
            me.popupAgregarSeguimiento = true;
            //variable si la data viene del asesor
            me.desdeAsesor = true
            me.update = false;
            //agregar las opciones al modal
            me.opciones.presentacion     = tr.opciones.presentacion
            me.opciones.entrega_muestras = tr.opciones.entrega_muestras
            me.opciones.reunion          = tr.opciones.reunion
            me.opciones.seguimiento      = tr.opciones.seguimiento
            me.opciones.cierre           = tr.opciones.cierre
            me.opciones.cobranza         = tr.opciones.cobranza
            me.opciones.post_venta       = tr.opciones.post_venta
            me.opciones.retiro_cartas    = tr.opciones.retiro_cartas
            me.opciones.retiro_muestras  = tr.opciones.retiro_muestras
            me.Fgenerar                  = tr.startDate
            me.seguimiento.observacion   = tr.url
         

        },
        confirmarRegistroPendiente(tr) {
            let me = this;
            me.id = tr.id
            this.$vs.dialog({
                type: 'confirm',
                color: 'danger',
                title: `Confirmar`,
                text: 'Esta seguro de registrar esta Planificación.',
                accept: this.registrarPendiente
            })
        },
        //prar registras las agendas pendientes
        registrarPendiente() {
            let me = this;
            let formData = new FormData();
            formData.append('id', me.id);
            me.$vs.loading();
            this.$http.post(this.$server_url + 'seguimiento-registrar', formData)
                .then(res => {

                    me.getRegistrosPendientes();

                    me.$vs.loading.close()
                    me.$vs.notify({
                        text: 'Se registro con exito',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                    location.reload()
                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()

                })

        },

         //para obtener el listado de los asesores
        getRegistrosPendientes() {
            let me = this;
            me.$vs.loading();
            this.$http.get(this.$server_url + 'seguimiento?asesor_id=' + me.asesor_id + '&pendientes=yes')
                .then(function (res) {
                    let datosProlipa = res.data.institucionesProlipa

                    for (let i = 0; i < datosProlipa.length; i++) {

                        me.institucionesProlipa.push({
                            "id": datosProlipa[i].id,
                            "id_usuario": datosProlipa[i].id_usuario,
                            "title": datosProlipa[i].title,
                            "label": datosProlipa[i].label,
                            "classes": datosProlipa[i].classes,
                            "startDate": datosProlipa[i].startDate,
                            "endDate": datosProlipa[i].endDate,
                            "hora_inicio": datosProlipa[i].hora_inicio,
                            "hora_fin": datosProlipa[i].hora_fin,
                            "url": datosProlipa[i].url,
                            "institucion_id": datosProlipa[i].institucion_id,
                            "institucion_id_temporal": datosProlipa[i].institucion_id_temporal,
                            "nombre_institucion_temporal": datosProlipa[i].nombre_institucion_temporal,
                            "estado_institucion_temporal": datosProlipa[i].estado_institucion_temporal,
                            "opciones": JSON.parse(datosProlipa[i].opciones),
                            "periodo_id": datosProlipa[i].periodo_id,
                            "estado": datosProlipa[i].estado,
                            "idperiodoescolar": datosProlipa[i].idperiodoescolar,
                            "periodo": datosProlipa[i].periodo,
                            "nombreInstitucion": datosProlipa[i].nombreInstitucion,
                            "vendedor": datosProlipa[i].vendedor
                        })
                    }

                    //para las instituciones temporales
                    let datosTemporales = res.data.institucionesTemporales
                   
                    for (let i = 0; i < datosTemporales.length; i++) {

                        me.institucionesTemporales.push({
                            "id": datosTemporales[i].id,
                            "id_usuario": datosTemporales[i].id_usuario,
                            "title": datosTemporales[i].title,
                            "label": datosTemporales[i].label,
                            "classes": datosTemporales[i].classes,
                            "startDate": datosTemporales[i].startDate,
                            "endDate": datosTemporales[i].endDate,
                            "hora_inicio": datosTemporales[i].hora_inicio,
                            "hora_fin": datosTemporales[i].hora_fin,
                            "url": datosTemporales[i].url,
                            "institucion_id": datosTemporales[i].institucion_id,
                            "institucion_id_temporal": datosTemporales[i].institucion_id_temporal,
                            "nombre_institucion_temporal": datosTemporales[i].nombre_institucion_temporal,
                            "estado_institucion_temporal": datosTemporales[i].estado_institucion_temporal,
                            "opciones": JSON.parse(datosTemporales[i].opciones),
                            "periodo_id": datosTemporales[i].periodo_id,
                            "estado": datosTemporales[i].estado,
                            "idperiodoescolar": datosTemporales[i].idperiodoescolar,
                            "periodo": datosTemporales[i].periodo,
                            "nombreInstitucion": datosTemporales[i].nombreInstitucion,
                            "vendedor": datosTemporales[i].vendedor
                        })
                    }

                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()

                })
        },
        //cantidad de escuelas del asesor
        async getVisitas() {
            let me = this;
            if (me.isAdmin == "yes") {
                me.asesorDesdeAdmin = localStorage.getItem("institucion_seguimiento_asesor_id")
            } else {
                me.asesorDesdeAdmin = me.usuario.idusuario
            }

            this.$http.get(this.$server_url + 'asesor/seguimiento?institucion_id=' + localStorage.institucion_seguimiento_id +'&nombreInstitucion='+localStorage.institucion_seguimiento_nombre+ '&periodo_id=' + me.periodo_id + '&asesor_id=' + me.asesorDesdeAdmin)
                .then(function (response) {
                    let datos = response.data;
                    let datosConvertir = datos.filter(p => p.tipo_seguimiento == me.tipo)
                    for (let i = 0; i < datosConvertir.length; i++) {
                            me.visitas.push({
                            "id": datosConvertir[i].id,
                            "num_visita": datosConvertir[i].num_visita,
                            "institucion_id": datosConvertir[i].institucion_id,
                            "asesor_id": datosConvertir[i].asesor_id,
                            "usuario_editor": datosConvertir[i].usuario_editor,
                            "tipo_seguimiento": datosConvertir[i].tipo_seguimiento,
                            "fecha_genera_visita": datosConvertir[i].fecha_genera_visita,
                            "fecha_que_visita": datosConvertir[i].fecha_que_visita,
                            "opciones": JSON.parse(datosConvertir[i].opciones),
                            "observacion":datosConvertir[i].observacion,
                            "periodo_id": datosConvertir[i].periodo_id,
                            "estado": datosConvertir[i].estado,
                            "nombreInstitucion":datosConvertir[i].nombreInstitucion,
                            "institucion_id_temporal": datosConvertir[i].institucion_id_temporal,
                            "nombre_institucion_temporal": datosConvertir[i].nombre_institucion_temporal,
                            "estado_institucion_temporal":datosConvertir[i].estado_institucion_temporal,
                            
                         
                        })
                    }
                })
                .catch(function (error) {

                })
        },
        openConfirm(tr){
            let me = this;
            me.id = tr.id
            this.$vs.dialog({
                type:'confirm',
                color: 'danger',
                title: `Confirmar`,
                text: 'Estas seguro de Eliminar',
                accept:this.eliminar,
                acceptText:"Aceptar",
                cancelText:"Cancelar"
            })
        },        
     //para eliminar la area
         eliminar() {
              let me = this;
              let formData = new FormData();
              formData.append('id',me.id);
              this.$http.post(this.$server_url+'seguimiento-eliminar', formData)
              .then(res => {

                  me.id = 0
                   this.$vs.notify({
                        text:'Se elimno correctamente',
                        color:'warning',
                        iconPack: 'feather',
                        icon:'icon-check'})
            
            if(me.isAdmin == "yes"){
                me.asesorDesdeAdmin = localStorage.getItem("institucion_seguimiento_asesor_id") 
            }else{
                me.asesorDesdeAdmin = me.usuario.idusuario
            }
            
            this.$http.get(this.$server_url+'asesor/seguimiento?institucion_id='+me.institucion_id+'&periodo_id='+me.periodo_id+'&asesor_id='+me.asesorDesdeAdmin)
                .then(function (response) {
                    let datos = response.data;
                    if(response.data.status == "0"){
                        me.visitas = []
                    }else{
                         me.visitas = datos.filter(p => p.tipo_seguimiento == me.tipo) 
                    }
                   
                })
                .catch(function (error) {
                    
                })
                 
              })
                .catch(function (error) {
                   
                })
        },

            openModalEdit(tr) {
            let me = this;
           
            me.id = tr.id
            me.Fgenerar = tr.fecha_genera_visita
            me.Fvisita = tr.fecha_que_visita
            me.seguimiento.observacion = tr.observacion
            me.popupEditarSeguimiento = true;
            //agregar las opciones al modal
            me.opciones.presentacion     = tr.opciones.presentacion
            me.opciones.entrega_muestras = tr.opciones.entrega_muestras
            me.opciones.reunion          = tr.opciones.reunion
            me.opciones.seguimiento      = tr.opciones.seguimiento
            me.opciones.cierre           = tr.opciones.cierre
            me.opciones.cobranza         = tr.opciones.cobranza
            me.opciones.post_venta       = tr.opciones.post_venta
            me.opciones.retiro_cartas    = tr.opciones.retiro_cartas
            me.opciones.retiro_muestras  = tr.opciones.retiro_muestras
            if(tr.estado_institucion_temporal == 0){
                me.nombreInstitucion = tr.nombreInstitucion
            }else{
                me.nombreInstitucion = tr.nombre_institucion_temporal
            }
            me.estado_institucion_temporal = tr.estado_institucion_temporal
            me.institucion_id_temporal = tr.institucion_id_temporal
            me.institucion_id = tr.institucion_id
        },
      generarSeguimiento() {
            let me = this;
        
            if (me.Fgenerar == null) {
                me.$vs.notify({
                    text: 'Debe escoger una fecha generar visita',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-check'
                })
                return false;
            }
            //validacion al editar
            if (me.update == true) {

                if (me.Fgenerar > me.Fvisita) {
                    me.$vs.notify({
                        text: 'La fecha de generar visita  no puede mayor  que la fecha de visita',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                    return false;
                }
            }
            me.visitas=[]

            let formData = new FormData();
            if (me.update = true) {
                formData.append('id', me.id);
                formData.append('fecha_que_visita', me.Fvisita);
                //solo si coloca la fecha de visita el estado cambiara a finalizdo
                if (me.Fvisita == null) {} else {
                    formData.append('finalizar', "yes")
                }
            }
            
            formData.append('estado_institucion_temporal', me.estado_institucion_temporal);
            formData.append('nombreInstitucion', localStorage.institucion_seguimiento_nombre);
            formData.append('fecha_genera_visita', me.Fgenerar);
            formData.append('observacion', me.seguimiento.observacion);
            if(me.estado_institucion_temporal == 1){
                formData.append('institucion_id', me.institucion_id_temporal);
            }else{
                formData.append('institucion_id', me.institucion_id);
            }
            if (me.isAdmin == "yes") {
                me.asesorDesdeAdmin = localStorage.getItem("institucion_seguimiento_asesor_id")
                formData.append('usuario_editor', me.usuario.idusuario);
                formData.append('admin', "yes");
            } else {
                me.asesorDesdeAdmin = me.usuario.idusuario
            }

            formData.append('asesor_id', me.asesorDesdeAdmin);
            formData.append('tipo_seguimiento', me.tipo);
            formData.append('periodo_id', me.periodo_id);
            formData.append('opciones', JSON.stringify(me.opciones));
        
            me.$vs.loading();
            this.$http.post(this.$server_url + 'guardarSeguimiento',formData)
                .then(function (res) {

                    me.$vs.loading.close()
                    me.$vs.notify({
                        text: res.data.message,
                        color: 'primary',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                    me.popupAgregarSeguimiento = false;
                    me.popupEditarSeguimiento = false;
                    me.getVisitas();
                    me.limpiar()
                    // location.reload()   
                

                })
                .catch(function (error) {
                    me.$vs.loading.close()
                });
        },
        limpiar() {
            let me = this;
            me.seguimiento.observacion = ""
            me.Fgenerar = null
            me.opciones.presentacion     = "" 
            me.opciones.entrega_muestras = "" 
            me.opciones.reunion          = "" 
            me.opciones.seguimiento      = "" 
            me.opciones.cierre           = "" 
            me.opciones.cobranza         = "" 
            me.opciones.post_venta       = "" 
            me.opciones.retiro_cartas    = "" 
            me.opciones.retiro_muestras  = "" 
            me.estado_institucion_temporal = "" 
            me.nombreInstitucion = ""
            

        }
    }
}
</script>