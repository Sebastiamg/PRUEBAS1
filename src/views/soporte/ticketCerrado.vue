<template>
    <div>
        <vs-card>
            <vs-row vs-justify="flex-start">
                <vs-col type="flex" vs-justify="flex-start" vs-align="flex-start" class="m-2" vs-w="12">
                    <p>Filtro de busqueda</p>
                    <br>
                    <vs-card>

                        <vs-row>
                            <vs-divider color="success">*Filtro por Fechas</vs-divider>

                            <vs-col  vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                            <flat-pickr :config="configdateTimePicker" v-model="fromDate"  placeholder="Fecha Inicio" class="m-1" style="display: inline-block;width: 100%;" />
                            </vs-col>

                            <vs-col  vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                            <flat-pickr :config="configdateTimePicker" v-model="toDate" placeholder="Fecha Fin" class="m-1" style="display: inline-block;width: 100%" />
                            </vs-col>
                            <vs-divider color="success">Filtro por criterio</vs-divider>

                            <br/>  <br/>
                            <vs-col  vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                                    <vs-input class="w-full" icon-after="true" label-placeholder="icon-after" style="margin:0px 0px 20px 0px;"  icon="search" placeholder="Ingrese el criterio de busqueda"  v-model="ticket.razonBusqueda"/>
                           
                            </vs-col>
                        </vs-row>
                    
                        
                        <div style="">
                        
                            <ul class="leftx" style="display:flex;margin:0px 0px 0px 20px;">
                                <li class="modelx">
                        
                                </li>
                                <li style="margin:10px 20px 0px 0px;">
                                    <vs-radio vs-name="radios1" vs-value="0" v-model="valorBusqueda" @input="busqueda='cedula'">Cedula</vs-radio>
                                </li>

                                <li style="margin:10px 10px 0px 0px;">
                                    <vs-radio vs-name="radios1" vs-value="1" v-model="valorBusqueda"  @input="busqueda='institucion'">Institucion</vs-radio>
                                </li>

                                <li style="margin:10px 20px 0px 0px;">
                                
                                    <vs-radio vs-name="radios1" vs-value="2" v-model="valorBusqueda" @input="busqueda='numero'">Ticket</vs-radio>
                                </li>

                                 <li style="margin:10px 20px 0px 0px;">
                                    <vs-radio vs-name="radios1" vs-value="3" v-model="valorBusqueda" @input="busqueda='fecha'">Fecha</vs-radio>
                                </li>

                                <li>
                                    <vs-button color="warning" type="filled" style="margin-left:10px;" @click="busquedaFiltroEstudiante();" icon="search"></vs-button>
                                </li>
                            
                            </ul>
                        </div>    

                    </vs-card>
                </vs-col>
            </vs-row>

             <br/>

             

            <div v-if="tickets.length >0 ">
                <br/>
                <p style="font-size:14px;" >Cantidad: <span style="color:coral;font-weight:bold;">{{ cantTickets }}</span></p>
            
                <br/>
                    <vx-tooltip style="display: inline-block;" text="Reporte General" position="top" color="primary">
                         <vs-button class="modal-default-button" style="margin-left:20px;"  size="small" @click="ModalReporteGeneral()" color="warning"  type="filled" icon-pack="feather" icon="icon-file-text"> </vs-button>
                    </vx-tooltip> &nbsp;
                <!-- <vs-button color="dark" @click="limpiar();popupAddTema=true;"   type="filled">Crear Area</vs-button> -->
                <vs-table max-items="10" search pagination :data="tickets" style="margin-top:-40px">
                    <template slot="thead">
                        <vs-th>Ticket #</vs-th>
                        <vs-th>Grupo</vs-th>
                        <vs-th>Asunto</vs-th>
                        <vs-th>Codigo</vs-th>
                        <vs-th>Fecha</vs-th>
                        <vs-th>Usuario</vs-th>
                        <vs-th>Estado</vs-th>
                        <vs-th>Acciones</vs-th>
                    </template>
                    <template slot-scope="{data}">
                        <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                            <vs-td>
                             {{data[indextr].ticket_id}}<br>
                            
                            </vs-td>
                            <vs-td>
                            
                                {{data[indextr].rol}}<br>
                                
                            </vs-td>
                            <vs-td>
                                {{data[indextr].descripcion}}<br>
                            </vs-td>
                            <vs-td>
                                <div v-if="tr.codigo == '0'">

                                </div>
                                <div v-else>
                                     {{data[indextr].codigo}}<br>
                                </div>

                           
                            </vs-td>
                            <vs-td>
                                <p style="font-size:11px;">{{ tr.fecha_ticket }} </p>
                                <p  style="font-size:11px;margin-top;3px;">{{ tr.fecha_ticket_final }}</p>
                                <p style="color:coral;font-size:11px;">Duracion:<span style="color:#9CC5E5;">{{tr.dias}} dias</span></p>
                            </vs-td>
                            <vs-td>
                                <p style="color:coral;font-size:12px;letter-spacing:1px;">Nombre: <span style="color:#2A9FF6;letter-spacing:0px;">{{ tr.usuario }}</span></p>
                                <p style="color:coral;font-size:12px;letter-spacing:1px;">Cedula: <span style="color:#2A9FF6;letter-spacing:0px;">{{ tr.cedula }}</span></p>
                                <p style="color:coral;font-size:12px;letter-spacing:1px;">Email: <span style="color:#2A9FF6;letter-spacing:0px;">{{ tr.email }}</span></p>
                                <p style="color:coral;font-size:12px;letter-spacing:1px;">Institucion: <span style="color:#2A9FF6;letter-spacing:0px;">{{ tr.nombreInstitucion }}</span></p>
                            </vs-td>

                            <vs-td>
                                <div v-if="tr.estado == '1'">
                                    <p>Abierto</p>
                                </div>
                                <div v-else>
                                    <p>Cerrada</p>    
                                </div>
                            </vs-td>

                            <vs-td>
                                <div style="display:flex;">
                                    <vx-tooltip style="display: inline-block;" text="Siguimiento del ticket" position="top" color="primary">
                                    <vs-button class="modal-default-button" size="small" color="success" @click="SeguimientoTicket(tr.ticket_id,tr.descripcion,tr.usuario,tr.email,tr.estado)" type="filled" icon-pack="feather" icon="icon-edit"> </vs-button>
                                    </vx-tooltip> &nbsp;

                                    <vx-tooltip style="display: inline-block;" text="Activar ticket" position="top" color="primary">
                                    <vs-button class="modal-default-button"  @click="openConfirm(tr.ticket_id)" size="small" color="primary"  type="filled" icon-pack="feather" icon="icon-check"> </vs-button>
                                    </vx-tooltip> &nbsp;

                                    <vx-tooltip style="display: inline-block;" text="Reporte ticket" position="top" color="primary">
                                    <vs-button class="modal-default-button" @click="getTicketRespuesta(tr.ticket_id,tr.descripcion,tr.codigo,tr.nombreInstitucion)" size="small" color="dark"  type="filled" icon-pack="feather" icon="icon-file-text"> </vs-button>
                                    </vx-tooltip> &nbsp;  

                                </div>
                        
                            </vs-td>
                      
                        </vs-tr>
                    </template>
                </vs-table>   
            </div>
            <div v-else class="p-3">
                <p> No existe tickets cerrados aun. </p>
            </div>
        </vs-card>
        <!--MODALES-->
        <!--Modal para filtro de reporte de ticket por institucion-->
        <vs-popup class="holamundo"  title="Filtro de Reporte General de Tickets" :active.sync="popupFiltroReporte">
            <p style="color:coral;font-weight:500;margin-bottom:10px;font-size:11px;">* Seleccione una institucion</p>
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" style="margin-bottom:20px;" vs-w="12">
                <v-select :options="instituciones" :reduce="instituciones => instituciones" label="nombreInstitucion" class="w-full" v-model="reporteTicket.institucion" />
            </vs-col>
            <vs-row>
                <p style="color:coral;font-weight:500;margin-bottom:10px;font-size:11px;">* Seleccione una fecha inicio - hasta para filtrar el Reporte</p>
                <vs-col  vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                   <flat-pickr :config="configdateTimePicker" v-model="fromDate"  placeholder="Fecha Inicio" class="m-1" style="display: inline-block;width: 100%;" />
                </vs-col>
                <vs-col  vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                  <flat-pickr :config="configdateTimePicker" v-model="toDate" placeholder="Fecha Fin" class="m-1" style="display: inline-block;width: 100%" />
                </vs-col>
            </vs-row>
             <vs-row>
                <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" style="margin-top:20px;">
                    <vs-button  type="gradient" @click="filtrarReporteGeneral()">Generar Pdf</vs-button>
                </vs-col>
            </vs-row>
        </vs-popup>
    </div>
</template>

<script>
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import vSelect from 'vue-select';
// import pdfMake from "pdfmake/build/pdfmake";
// var pdfFonts = require ('pdfmake/build/vfs_fonts.js');
// pdfMake.vfs = pdfFonts.pdfMake.vfs;

export default{
  created () {
      let me = this;
      me.usuario = JSON.parse(localStorage.getItem("usuario"))
  },
  components:{
       'v-select': vSelect,
        flatPickr,
  },
    data(){
        return{
            usuario:[],
            instituciones:[],
            popupFiltroReporte:false,
            ticket:{
                razonBusqueda:'',
            },
            tickets:[],
            ticketsRespuesta:[],
            ticketsReporteGeneral:[],
            ticket_id:0,
            valorBusqueda:'0',
            busqueda:'cedula',
            fromDate: null,
            toDate: null,
            configdateTimePicker: {
                enableTime: true,
                dateFormat: 'Y-m-d'
            },
            reporteTicket:{
                institucion:"",
            }
        }
    },
    methods:{
        //para dar seguimiento al ticket
        SeguimientoTicket(ticket_id,asunto,usuario,email,estado){
            let me = this;
            localStorage.setItem("ticket_id",ticket_id);
            localStorage.setItem("asunto",asunto);
            localStorage.setItem("usuario_ticket",usuario);
            localStorage.setItem("email_ticket",email);
            localStorage.setItem("estado_ticket",estado);
            localStorage.setItem("ticketAyuda","no");
            me.$router.push('/soporte/ticket/abierto/');
        },
         openConfirm(ticket_id){
            let me =this;
            me.ticket_id = ticket_id;
            me.$vs.dialog({
                type:'confirm',
                color: 'danger',
                title: `Confirm`,
                text: 'Estas seguro/a de cambiar de estado el ticket.',
                accept:me.AbrirTicket
            })
        },
       AbrirTicket(){
            let me = this;
            me.$vs.loading();
            this.$http.get(this.$server_url+"ticket?estadoChange=yes&estado=1&ticket_id="+me.ticket_id)
                .then(function (res) {                
                    me.$vs.loading.close()
                    me.$vs.notify({
                    text:'Ticket cambiado con exito',
                    color:'success',
                    iconPack: 'feather',
                    icon:'icon-check'})
                    me.busquedaFiltroEstudiante();
                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()
                })
        },
        busquedaFiltroEstudiante(){
            let me = this;
            me.tickets = [];
            //para el filtro por numero del ticket
            if(me.busqueda == 'numero'){
                if(me.ticket.razonBusqueda.length < 1){      
                    me.$vs.notify({
                    text:'Minimo 1 caracter de busqueda',
                    color:'warning',
                    iconPack: 'feather',
                    icon:'icon-check'})  
                    return false;    
                }
            }
            //para el filtro por fechas
            if(me.busqueda == 'fecha'){
                 if(me.fromDate == null){
                      me.$vs.notify({
                        text: 'Debe escoger una fecha inicio',
                        color:'warning',
                        iconPack: 'feather',
                        icon:'icon-check'})
                    return false;
                }
                if(me.toDate == null){
                    me.$vs.notify({
                        text: 'Debe escoger una fecha final',
                        color:'warning',
                        iconPack: 'feather',
                        icon:'icon-check'})
                        return false;
                }
                if(me.fromDate > me.toDate){
                    me.$vs.notify({
                        text: 'La fecha inicio no puede mayor que la fecha final',
                        color:'warning',
                        iconPack: 'feather',
                        icon:'icon-check'})
                    return false;
                }
            }
            if(me.busqueda == 'cedula' || me.busqueda == 'institucion' ){
                if(me.ticket.razonBusqueda.length < 5){     
                    me.$vs.notify({
                    text:'Minimo 5 caracteres de busqueda',
                    color:'warning',
                    iconPack: 'feather',
                    icon:'icon-check'})  
                    return false;    
                }
            }
            me.$vs.loading();
            this.$http.get(this.$server_url+'ticket?busqueda='+me.busqueda+'&razonBusqueda='+me.ticket.razonBusqueda+'&fromDate='+me.fromDate+'&toDate='+me.toDate)
                .then(function (res) {
                     me.$vs.loading.close()
                     if(res.data.status == '0'){
                        me.$vs.notify({
                        text: res.data.message,
                        color:'primary',
                        iconPack: 'feather',
                        icon:'icon-check'})
                        return false;
                    }else{
                        let datos = res.data.ticketCerrado
                        if(me.usuario.id_group == '1'){
                        me.tickets = datos.filter(p => p.ticket_asesor == '0')
                        me.cantTickets = me.tickets.length
                        }else{
                            me.tickets = datos.filter(p => p.ticket_asesor == '1' && p.vendedorInstitucion == me.usuario.cedula)
                            me.cantTickets = me.tickets.length
                        }
                        me.instituciones = res.data.filtroInstituciones
                        // me.fromDate = null;
                        // me.toDate = null;
                        me.ticket.razonBusqueda = '';
                    }
                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()
                })
        },
        getTicketRespuesta(ticket_id,asunto,codigo,nombreInstitucion) {
            let me = this;
            localStorage.setItem("asunto",asunto);
            localStorage.setItem("ticket_id",ticket_id);
             localStorage.setItem("ticket_codigo",codigo);
            localStorage.setItem("ticket_nombreInstitucion",nombreInstitucion);
            me.$vs.loading();
            this.$http.get(this.$server_url+'ticket?RespuestaTicketAbiertoReporte=yes&ticket_id='+ticket_id)
                .then(function (res) {
                    me.ticketsRespuesta = res.data
                    me.$vs.loading.close()
                    // me.reporte();
                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()
                })
        },
        //filtro reporte por fechas
        ModalReporteGeneral(){
            let me = this;
            me.popupFiltroReporte = true;
        },
        filtrarReporteGeneral(){
            let me = this;
            if(me.reporteTicket.institucion == ""){
                me.$vs.notify({
                    text: 'Debe escoger una institucion',
                    color:'warning',
                    iconPack: 'feather',
                    icon:'icon-check'})
                return false;
            }
           if(me.fromDate == null){
               me.$vs.notify({
                    text: 'Debe escoger una fecha inicio',
                    color:'warning',
                    iconPack: 'feather',
                    icon:'icon-check'})
                return false;
           }
            if(me.toDate == null){
               me.$vs.notify({
                    text: 'Debe escoger una fecha final',
                    color:'warning',
                    iconPack: 'feather',
                    icon:'icon-check'})
                return false;
           }
            if(me.fromDate > me.toDate){
                 me.$vs.notify({
                    text: 'La fecha inicio no puede mayor que la fecha final',
                    color:'warning',
                    iconPack: 'feather',
                    icon:'icon-check'})
                return false;
            }
            localStorage.setItem("ticket_nombreInstitucion",me.reporteTicket.institucion.nombreInstitucion);
            me.$vs.loading();
            this.$http.get(this.$server_url+'ticket?reporteGeneral=yes&institucion_id='+me.reporteTicket.institucion.idInstitucion+'&fromDate='+me.fromDate+'&toDate='+me.toDate)
                .then(function (res) {
                    me.ticketsReporteGeneral = res.data
                    me.$vs.loading.close()
                    if(res.data.status == '0'){
                        me.$vs.notify({
                        text: res.data.message,
                        color:'primary',
                        iconPack: 'feather',
                        icon:'icon-check'})
                        return false;
                    }else{
                        // me.reporteGeneral();
                        me.popupFiltroReporte = false;
                        me.fromDate = null;
                        me.toDate = null;
                    }
                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()
                })
        },
        //para generar el reporte General
    //     reporteGeneral() {
    //         var body = [];
    //         body.push([{text: 'Ticket'},{text: 'Usuario'},{text: 'asunto'}, {text: 'Duracion'},]);
    //         for (var key in this.ticketsReporteGeneral) 
    //         {
    //             if (this.ticketsReporteGeneral.hasOwnProperty(key))
    //             {
    //                 var item = this.ticketsReporteGeneral[key];
    //                 var fila = new Array();
    //                 fila.push([ { text:'Ticket #: '+item.ticket_id.toString(), style: 'codigo' }, { text:'Grupo: '+item.rol.toString(), style: 'codigo' },{ text:'codigo: '+item.codigo.toString(), style: 'usuario' },{ text:'Interacciones: '+item.cantidad.toString(), style: 'usuario' },])
    //                 fila.push([ { text:'Nombres: '+item.usuario.toString(), style: 'codigo' },{ text:'cedula: '+item.cedula.toString(), style: 'usuario' },])
    //                 fila.push( item.descripcion.toString() );
    //                 fila.push( item.dias.toString() + ' dias'  );
    //                 body.push(fila);
    //             }
    //         }
    //         var dd = {
    //             content: [
    //                 { text:'Reporte General de tickets de'+' '+localStorage.getItem("ticket_nombreInstitucion"), style: 'header' },
    //                 ' ',
    //                 ' ',
    //                 {
    //                     table: 
    //                     {
    //                         headerRows: 1,
    //                         body: body
    //                     }
    //                 }
    //             ],
    //             styles: {
    //                 header: {
    //                     fontSize: 18,
    //                     bold: true,
    //                     alignment: 'center'
    //                 },
    //                  codigo: {
    //                 italics: true,
    //                 alignment: 'left',
    //                 },
    //                 usuario: {
    //                 italics: true,
    //                 alignment: 'left',
    //                 },
    //             }
    //         };
    //      pdfMake.createPdf(dd).download("TicketGeneral.pdf");
    //     },
    //     //para generar el reporte
    //     reporte() {
    //         var body = [];
    //         body.push([{text: 'Grupo'},{text: 'Usuario'},{text: 'mensaje'}, {text: 'fecha'},]);
    //         for (var key in this.ticketsRespuesta) 
    //         {
    //             if (this.ticketsRespuesta.hasOwnProperty(key))
    //             {
    //                 var item = this.ticketsRespuesta[key];
    //                 var fila = new Array();
    //                 fila.push( item.rol.toString() );
    //                 fila.push([ { text:'Nombres: '+item.usuario.toString(), style: 'codigo' },{ text:'cedula: '+item.cedula.toString(), style: 'usuario' },])
    //                 fila.push( item.descripcion.toString() );
    //                 fila.push( item.fecha.toString()  );
    //                 body.push(fila);
    //             }
    //         }
    //         var dd = {
    //             content: [
    //                 { text:'Ticket #'+localStorage.getItem("ticket_id")+ ' '+localStorage.getItem("asunto") , style: 'header' },
    //                 ' ',
    //                 ' ',
    //                 { text:'Codigo: '+localStorage.getItem("ticket_codigo"), style: 'codigo' },
                    
    //                 { text:'Institucion: '+localStorage.getItem("ticket_nombreInstitucion"), style: 'institucion' },
    //                 ' ',
    //                 ' ',
    //                 {
    //                     table: 
    //                     {
    //                         headerRows: 1,
    //                         body: body
    //                     }
    //                 }
    //             ],
    //             styles: {
    //                 header: {
    //                     fontSize: 18,
    //                     bold: true,
    //                     alignment: 'center'
    //                 },
    //                 codigo: {
    //                 italics: true,
    //                 alignment: 'left',
    //                 bold: true,
    //                 },
    //                 usuario: {
    //                 italics: true,
    //                 alignment: 'left',
    //                 },
    //                 institucion: {
    //                 italics: true,
    //                 alignment: 'left',
    //                 bold: true,
    //                 }
    //             }
    //         };
    //      pdfMake.createPdf(dd).download("TicketIndividual.pdf");
    //    },
    },
}
</script>