<template>
<!-- NOTIFICATIONS -->
<div>
    <!--NOTIFICACIONES PARA PEDIDOS-->
    <vs-dropdown vs-custom-content vs-trigger-click class="cursor-pointer" @click="handleClick" v-if=" usuario.id_group == 11 || userRoot == true || usuario.id_group == 23 || usuario.id_group == 22">
        <div style="display: none">
            <screenNotificacionVue :cambiarNotificacion="cambiarNotificacion" @ChangecantidadMensajes="changeCantidadMensajes" @rechargeVerificaciones="getNotificacionesVerificaciones" @click.stop.prevent />
        </div>
        <div v-if="(contadorNoLeidos + (notificacionesProformas.length?notificacionesProformas.length:0)) > 0">
            <p>
                <feather-icon icon="BellIcon" style=" background-color: #06d755; padding: 3px; border-radius: 50%; border: 5px solid #4de346; " class="cursor-pointer mt-1 sm:mr-6 mr-2" :badge="(contadorNoLeidos + (notificacionesProformas.length?notificacionesProformas.length:0))" />
            </p>
        </div>
        <div v-else>
            <feather-icon icon="BellIcon" class="cursor-pointer mt-1 sm:mr-6 mr-2" />
        </div>
        <vs-dropdown-menu class="notification-dropdown dropdown-custom vx-navbar-dropdown">
            <div class="notification-top text-center p-5 bg-success text-white">
                <h3 class="text-white">Notificaciones</h3>
                <p class="opacity-75">
                    {{ notificacionesProformas.length === 0
                      ? (tmparregloNotificaciones.length === 0 ? "No hay Notificaciones" : "Lista de notificaciones")
                      : "Lista de notificaciones" }}
                </p>
            </div>
            <component :is="scrollbarTag" ref="mainSidebarPs" class="scroll-area--nofications-dropdown p-0 mb-10" :settings="settings" :key="$vs.rtl">
                <ul class="bordered-items" v-if="allNotifications.length > 0">
                    <li v-for="ntf in allNotifications" :key="ntf.index" class="px-4 py-5 notification cursor-pointer">
                        <div v-if="ntf.tipo == 4">
                            <div class="flex justify-between">
                                <div class="flex items-start">
                                    <feather-icon icon="FileTextIcon"></feather-icon>
                                    <div class="mx-2">
                                        <h4 style="font-size: 18px !important">
                                            {{ ntf.agrupado }}
                                        </h4>
                                    </div>
                                </div>
                                <small class="mt-1 whitespace-no-wrap">{{ elapsedTime(ntf.fecha_solicita) }}</small>
                            </div>
                            <div>
                                <div>
                                    <p class="mt-4" style="font-size: 10px !important">
                                        Periodo: <b>{{ ntf.periodo }}</b>
                                    </p>
                                    <p class="mt-1" style="font-size: 10px !important">
                                        Descripción: {{ ntf.descripcion }}
                                    </p>
                                    <p style="font-size: 10px !important">{{ ntf.asesor }}</p>
                                    <p class="mt-1"></p>
                                    <div>
                                        <vs-chip :color="ntf.tipo==4?'danger':ntf.color">{{ ntf.nombre }}</vs-chip>
                                    </div>
                                    <div class="vx-row">
                                        <!--marcar notificacion como leida en un span-->
                                        <vs-button color="warning" @click="f_marcarComoLeida(ntf)" class="ml-2 notificacion-leida text-white p-2" style="font-size: 10px !important"><i class="fa-solid fa-check-to-slot"></i> Marcar como
                                            leida</vs-button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-else class="flex justify-between" @click="datoschat= ntf;popupNotificaciones = true">
                            <div class="flex items-start">
                                <b v-if="ntf.contadorVistos > 0" class="contador">{{ ntf.contadorVistos }}</b>
                                <!-- <feather-icon icon="FileTextIcon"></feather-icon> -->
                                <div class="mx-2" @click="verNotificacion(ntf)">
                                    <h4 style="font-size: 12px !important">
                                        {{ ntf.nombreInstitucion }}
                                    </h4>

                                    <small>{{ ntf.contadorMensajes[0].comentario.substring(0, 35) }}...</small>
                                    <p class="mt-4" style="font-size: 10px !important">
                                        Pedido #{{ ntf.id_pedido }}
                                    </p>
                                    <p style="font-size: 10px !important" v-if="usuario.id_group == 11">
                                        Administrador ({{ getAdministradorMensaje(ntf.contadorMensajes) }})
                                    </p>
                                    <p v-else style="font-size: 10px !important">
                                        {{ ntf.asesor }}
                                    </p>
                                    <p style="font-size: 11px">{{ ntf.ciudad }}</p>
                                </div>
                            </div>
                            <small class="mt-1 whitespace-no-wrap">{{ elapsedTime(ntf.contadorMensajes[0].created_at) }}</small>
                        </div>

                    </li>
                </ul>
            </component>

            <div class="checkout-footer fixed bottom-0 rounded-b-lg text-primary w-full p-2 font-semibold text-center border border-b-0 border-l-0 border-r-0 border-solid d-theme-border-grey-light cursor-pointer">
                <span></span>
            </div>
        </vs-dropdown-menu>
        <!--MODAL CHAT NOTIFICACIONES-->
        <vs-popup classContent="popup-example" fullscreen title="Mensajes asesor - facturador" :active.sync="popupNotificaciones" @close="RecargarNotificaciones()">
            <screenNotificacionVue v-if="popupNotificaciones" :cambiarNotificacion="cambiarNotificacion" :datosEnviar="datoschat" ref="screenNotificacionVue" />
        </vs-popup>
    </vs-dropdown>

    <!--NOTIFICACIONES PARA VERIFICACIONES -->
    <vs-dropdown vs-custom-content vs-trigger-click class="cursor-pointer" @click="handleClick" v-if="
        userRoot == true || usuario.id_group == 23 || usuario.id_group == 22
      ">
        <div>
            <div v-if="arregloNotificacionVerificacion.length > 0">
                <p>
                    <feather-icon icon="ActivityIcon" style=" background-color: #06d755; padding: 3px; border-radius: 50%; border: 5px solid #4de346; " class="cursor-pointer mt-1 sm:mr-6 mr-2" :badge="arregloNotificacionVerificacion.length" />
                </p>
            </div>
            <div v-else>
                <feather-icon icon="ActivityIcon" class="cursor-pointer mt-1 sm:mr-6 mr-2" />
            </div>
            <vs-dropdown-menu class="notification-dropdown dropdown-custom vx-navbar-dropdown">
                <div class="notification-top text-center p-5 bg-success text-white">
                    <h3 class="text-white">Notificaciones</h3>
                    <p class="opacity-75">
                        {{ arregloNotificacionVerificacion.length == 0
                          ? "No hay Notificaciones"
                          : ""
                        }}
                    </p>
                </div>
                <component :is="scrollbarTag" ref="mainSidebarPs" class="scroll-area--nofications-dropdown p-0 mb-10" :settings="settings" :key="$vs.rtl">
                    <ul class="bordered-items" v-if="arregloNotificacionVerificacion.length > 0">
                        <li v-for="ntf in arregloNotificacionVerificacion" :key="ntf.index" class="px-4 py-5 notification cursor-pointer">
                            <div class="flex justify-between">
                                <div class="flex items-start">
                                    <feather-icon icon="FileTextIcon"></feather-icon>
                                    <div class="mx-2">
                                        <h4 style="font-size: 12px !important">
                                            {{ ntf.nombreInstitucion }}
                                        </h4>
                                    </div>
                                </div>
                                <small class="mt-1 whitespace-no-wrap">{{ elapsedTime(ntf.fecha_solicita) }}</small>
                            </div>
                            <div>
                                <div v-if="ntf.tipo != 6">
                                    <p class="mt-4" style="font-size: 10px !important" v-if="ntf.contrato_generado">
                                        Contrato: {{ ntf.contrato_generado }}
                                    </p>
                                    <p class="mt-1" style="font-size: 10px !important">{{ ntf.asesor }}</p>
                                    <p style="font-size: 11px">{{ ntf.ciudad }}</p>
                                    <p class="mt-1"></p>
                                    <div v-if="ntf.tipo == '1'" class="py-4" style="position: relative; top: -8px">
                                        <vs-chip v-if="ntf.tipo_venta_descr" color="dark">{{ ntf.tipo_venta_descr}}
                                        </vs-chip>
                                        <vs-button color="warning" @click="f_marcarComoLeida(ntf)" class="ml-2 notificacion-leida text-white p-2" style="font-size: 10px !important"><i class="fa-solid fa-check-to-slot"></i> Marcar como
                                            leida
                                        </vs-button>
                                    </div>
                                    <div v-if="ntf.tipo != '1'">
                                        <vs-chip :color="ntf.tipo==3?'danger':ntf.color">{{ ntf.nombre }}</vs-chip>
                                    </div>
                                    <div v-if="ntf.tipo != '1'" class="vx-row">
                                        <!--marcar notificacion como leida en un span-->
                                        <vs-button v-if="ntf.tipo != '1'" color="warning" @click="f_marcarComoLeida(ntf)" class="ml-2 notificacion-leida text-white p-2" style="font-size: 10px !important"><i class="fa-solid fa-check-to-slot"></i> Marcar como
                                            leida</vs-button>
                                    </div>
                                </div>
                                <div v-else-if="ntf.tipo == 6">
                                    <p class="mt-1" style="font-size: 10px !important">
                                        ID Fichero: {{ ntf.id_padre }}
                                    </p>
                                    <p class="mt-1" style="font-size: 10px !important">
                                        Periodo: {{ ntf.descripcion_periodoescolar }}
                                    </p>
                                    <p class="mt-1" style="font-size: 10px !important">
                                        Usuario que envía: {{ ntf.user_envia_nombres }} {{ ntf.user_envia_apellidos }}
                                    </p>
                                    <p style="font-size: 11px">{{ ntf.ciudad }}</p>
                                    <p class="mt-1"></p>
                                    <div>
                                        <vs-chip color="danger">{{ ntf.nombre }}</vs-chip>
                                    </div>
                                    <div v-if="ntf.tipo != '1'" class="vx-row">
                                        <!--marcar notificacion como leida en un span-->
                                        <vs-button v-if="ntf.tipo != '1'" color="warning" @click="f_marcarComoLeida(ntf)" class="ml-2 notificacion-leida text-white p-2" style="font-size: 10px !important"><i class="fa-solid fa-check-to-slot"></i> Marcar como
                                            leida</vs-button>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </component>
                <div class="checkout-footer fixed bottom-0 rounded-b-lg text-primary w-full p-2 font-semibold text-center border border-b-0 border-l-0 border-r-0 border-solid d-theme-border-grey-light cursor-pointer">
                    <span></span>
                </div>
            </vs-dropdown-menu>
        </div>
    </vs-dropdown>

    <!--NOTIFICACIONES PARA VERIFICACIONES -->
    <vs-dropdown vs-custom-content vs-trigger-click class="cursor-pointer" @click="getNotificacionesVerificaciones()" v-if="usuario.id_group == 11">
        <div>
            <div v-if="notificacionesVerificacionesAsesor.length > 0">
                <p>
                    <feather-icon icon="ActivityIcon" style="
                background-color: #06d755;
                padding: 3px;
                border-radius: 50%;
                border: 5px solid #4de346;
              " class="cursor-pointer mt-1 sm:mr-6 mr-2" :badge="notificacionesVerificacionesAsesor.length" />
                </p>
            </div>
            <div v-else>
                <feather-icon icon="ActivityIcon" class="cursor-pointer mt-1 sm:mr-6 mr-2" />
            </div>
            <vs-dropdown-menu class="notification-dropdown dropdown-custom vx-navbar-dropdown">
                <div class="notification-top text-center p-5 bg-success text-white">
                    <h3 class="text-white">Notificaciones</h3>
                    <p class="opacity-75">
                        {{
                          notificacionesVerificacionesAsesor.length == 0
                            ? "No hay Solicitudes de verificaciones"
                            : "Solicitudes de verificaciones"
                        }}
                    </p>
                </div>
                <component :is="scrollbarTag" ref="mainSidebarPs" class="scroll-area--nofications-dropdown p-0 mb-10" :settings="settings" :key="$vs.rtl">
                    <ul class="bordered-items" v-if="notificacionesVerificacionesAsesor.length > 0">
                        <li v-for="ntf in notificacionesVerificacionesAsesor" :key="ntf.index" class="px-4 py-5 notification cursor-pointer">
                            <div class="flex justify-between">
                                <div class="flex items-start">
                                    <feather-icon icon="FileTextIcon"></feather-icon>
                                    <div class="mx-2">
                                        <h4 style="font-size: 12px !important">
                                            {{ ntf.nombreInstitucion }}
                                        </h4>
                                    </div>
                                </div>
                                <small class="mt-1 whitespace-no-wrap">{{ elapsedTime(ntf.fecha_solicita)}}</small>
                            </div>
                            <div>
                                <div v-if="ntf.tipo != 7 && ntf.tipo != 8 && ntf.tipo != 9">
                                    <p class="mt-4" style="font-size: 10px !important">
                                        Contrato: {{ ntf.contrato_generado }}
                                    </p>
                                    <p style="font-size: 10px !important">{{ ntf.asesor }}</p>
                                    <p style="font-size: 11px">{{ ntf.ciudad }}</p>
                                    <p class="mt-1"></p>
                                    <div v-if="ntf.tipo == '1'" class="py-4" style="position: relative; top: -8px">
                                        <vs-chip v-if="ntf.tipo_venta_descr" color="dark">{{ ntf.tipo_venta_descr}}
                                        </vs-chip>
                                    </div>
                                    <div v-if="ntf.tipo != '1'">
                                        <vs-chip :color="ntf.color">{{ ntf.nombre }}</vs-chip>
                                    </div>
                                    <div v-if="ntf.tipo != '1'" class="vx-row">
                                        <!--marcar notificacion como leida en un span-->
                                        <vs-button v-if="ntf.tipo != '1'" color="warning" @click="f_marcarComoLeida(ntf)" class="ml-2 notificacion-leida text-white p-2" style="font-size: 10px !important"><i class="fa-solid fa-check-to-slot"></i> Marcar como
                                            leida</vs-button>
                                    </div>
                                </div>
                                <div v-else-if="ntf.tipo == 7">
                                    <p class="mt-1" style="font-size: 10px !important">
                                        ID Fichero: {{ ntf.id_padre }}
                                    </p>
                                    <p class="mt-1" style="font-size: 10px !important">
                                        Periodo: {{ ntf.descripcion_periodoescolar }}
                                    </p>
                                    <p class="mt-1" style="font-size: 10px !important">
                                        Aprobado por: {{ ntf.user_aprobacion_nombres }} {{ ntf.user_aprobacion_apellidos }}
                                    </p>
                                    <p style="font-size: 11px">{{ ntf.ciudad }}</p>
                                    <div>
                                        <vs-chip color="primary">{{ ntf.nombre }}</vs-chip>
                                    </div>
                                    <div class="vx-row">
                                        <!--marcar notificacion como leida en un span-->
                                        <vs-button color="warning" @click="f_marcarComoLeida(ntf)" class="ml-2 notificacion-leida text-white p-2" style="font-size: 10px !important"><i class="fa-solid fa-check-to-slot"></i> Marcar como
                                            leida</vs-button>
                                    </div>
                                </div>
                                <div v-else-if="ntf.tipo == 8">
                                    <p class="mt-1" style="font-size: 10px !important">
                                        ID Fichero: {{ ntf.id_padre }}
                                    </p>
                                    <p class="mt-1" style="font-size: 10px !important">
                                        Periodo: {{ ntf.descripcion_periodoescolar }}
                                    </p>
                                    <p class="mt-1" style="font-size: 10px !important">
                                        Devuelto por: {{ ntf.user_rechazo_nombres }} {{ ntf.user_rechazo_apellidos }}
                                    </p>
                                    <p class="mt-2 p-2 rounded border-l-4 border-blue-500 bg-blue-50 text-blue-700" style="font-size: 10px; line-height: 1.4;">
                                        Este fichero ha sido devuelto para que lo revises y realices las modificaciones necesarias.
                                        Una vez revisado, envíalo para aprobación.
                                    </p>
                                    <div>
                                        <vs-chip color="danger">{{ ntf.nombre }}</vs-chip>
                                    </div>
                                    <div class="vx-row">
                                        <!--marcar notificacion como leida en un span-->
                                        <vs-button color="warning" @click="f_marcarComoLeida(ntf)" class="ml-2 notificacion-leida text-white p-2" style="font-size: 10px !important"><i class="fa-solid fa-check-to-slot"></i> Marcar como
                                            leida</vs-button>
                                    </div>
                                </div>
                                <div v-else-if="ntf.tipo == 9">
                                    <p class="mt-1" style="font-size: 10px !important">
                                        ID Fichero: {{ ntf.id_padre }}
                                    </p>
                                    <p class="mt-1" style="font-size: 10px !important">
                                        Periodo: {{ ntf.descripcion_periodoescolar }}
                                    </p>
                                    <p class="mt-1" style="font-size: 10px !important">
                                        Activado por: {{ ntf.usuario_activa }}
                                    </p>
                                    <p class="mt-2 p-2 rounded border-l-4 border-blue-500 bg-blue-50 text-blue-700" style="font-size: 10px; line-height: 1.4;">
                                        Este fichero ha sido cambiado a estado creado para que lo revises y realices las modificaciones necesarias.
                                        Una vez revisado, envíalo para aprobación.
                                    </p>
                                    <div class="mt-2">
                                        <vs-chip color="primary">{{ ntf.nombre }}</vs-chip>
                                    </div>
                                    <div class="vx-row">
                                        <!--marcar notificacion como leida en un span-->
                                        <vs-button color="warning" @click="f_marcarComoLeida(ntf)" class="ml-2 notificacion-leida text-white p-2" style="font-size: 10px !important"><i class="fa-solid fa-check-to-slot"></i> Marcar como
                                            leida</vs-button>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </component>
                <div class="checkout-footer fixed bottom-0 rounded-b-lg text-primary w-full p-2 font-semibold text-center border border-b-0 border-l-0 border-r-0 border-solid d-theme-border-grey-light cursor-pointer">
                    <span></span>
                </div>
            </vs-dropdown-menu>
        </div>
        <screenHome v-show="mostrarAsesorHome" ref="asesorHomeRef" />

    </vs-dropdown>
</div>
</template>

<script>
// import io from 'socket.io-client';
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import Vue from "vue";
import axios from "axios";
import moment from "moment";
import screenNotificacionVue from "../../../../views/pedidos/notificaciones/screenNotificacion.vue";
import NotificationService from '@/services/NotificationService';
import screenHome from '@/views/Home.vue';
Vue.use(axios);
Vue.filter("fecha", function (value) {
    var fechaActual = moment().format("YYYY-MM-DD");
    var fecha = moment(String(value)).format("YYYY-MM-DD");
    var fechaInicio = new Date(fecha).getTime();
    var fechaFin = new Date(fechaActual).getTime();
    var diff = fechaFin - fechaInicio;
    const resultado = diff / (1000 * 60 * 60 * 24);
    if (resultado == 0) {
        return "hoy";
    } else {
        let dato = "Hace " + resultado + " dias";
        return dato;
    }
});
export default {
    components: {
        VuePerfectScrollbar,
        screenNotificacionVue,
        screenHome,
    },
    created() {
        let me = this;
        this.usuario = JSON.parse(localStorage.getItem("usuario"));
        let getGrupo = this.usuario.id_group;

        if (getGrupo == 1 || getGrupo == 22 || getGrupo == 23 || getGrupo == 11) {
            // Crear una instancia del servicio de notificaciones
            this.notificationService = new NotificationService(
                'admin.notifications_verificaciones', // Nombre del canal
                'NewNotification', // Nombre del evento
                this.handleNotification.bind(this) // Función para manejar la notificación
            );

            // Iniciar la escucha de notificaciones
            this.notificationService.startListening();
        }
        if (getGrupo == 11) {
            // Crear una instancia del servicio de notificaciones
            this.notificationService = new NotificationService(
                'asesor.notificacionVerificacion', // Nombre del canal
                'NewNotification', // Nombre del evento
                this.handleNotification.bind(this) // Función para manejar la notificación
            );

            // Iniciar la escucha de notificaciones
            this.notificationService.startListening();
            // this.getNotificacionesAsesor();

            // Notificaciones capacitaciones
            this.notificationService = new NotificationService(
                'capacitador.notificacionCapacitaciones', // canal
                'NewNotification', // evento
                this.handleNotificationCapacitaciones.bind(this)
            );

            // Iniciar la escucha de notificaciones
            this.notificationService.startListening();
        }

    },
    data() {
        return {
            // socket: io("http://localhost:3000/"),
            // socket: io("https://socket.prolipadigital.com.ec/"),
            condicion: 0,
            notifications: [],
            arregloNotificaciones: [],
            tmparregloNotificaciones: [],
            popupNotificaciones: false,
            cambiarNotificacion: false,
            arregloNotificacionVerificacion: [],
            contadorVerificaciones: 0,
            contadorNoLeidos: 0,
            usuario: [],
            tareasp: [],
            tarease: [],
            userRoot: false,
            unreadNotifications: [{
                    index: 0,
                    title: "New Message",
                    msg: "Are your going to meet me tonight?",
                    icon: "MessageSquareIcon",
                    time: this.randomDate({
                        sec: 10,
                    }),
                    category: "primary",
                },
                {
                    index: 1,
                    title: "New Order Recieved",
                    msg: "You got new order of goods.",
                    icon: "PackageIcon",
                    time: this.randomDate({
                        sec: 40,
                    }),
                    category: "success",
                },
            ],
            settings: {
                maxScrollbarLength: 60,
                wheelSpeed: 0.6,
            },

            // notificaciones verificaciones asesor
            notificacionesVerificacionesAsesor: [],
            // notificaciones de proformas
            notificacionesProformas: [],

            isExecuting: false,

            datoschat: [],

            mostrarAsesorHome: false,
            asesorHomeKey: 0,

        };
    },
    mounted() {
        let me = this;
        if (
            me.usuario.id_group == 1 ||
            me.usuario.id_group == 22 ||
            me.usuario.id_group == 23 ||
            me.usuario.id_group == 11
        ) {
            this.getNotificaciones();
            this.getNotificacionesVerificaciones();
            me.getUserRoot(me.usuario);
        }
    },
    computed: {
        scrollbarTag() {
            return this.$store.getters.scrollbarTag;
        },
        allNotifications() {
            // Combina las dos listas
            let combinedNotifications = [
                ...this.tmparregloNotificaciones.map(ntf => ({
                    ...ntf,
                    fecha: ntf.contadorMensajes[0].created_at // Asume la fecha del primer mensaje de la notificación
                })),
                ...this.notificacionesProformas.map(ntf => ({
                    ...ntf,
                    fecha: ntf.fecha_solicita // Utiliza fecha_solicita de las proformas
                }))
            ];

            // Ordenar por la fecha, de más reciente a más antigua
            combinedNotifications.sort((a, b) => {
                const dateA = new Date(a.fecha);
                const dateB = new Date(b.fecha);
                return dateB - dateA; // Orden descendente
            });

            return combinedNotifications;
        }
    },
    methods: {
        handleNotificationCapacitaciones() {
            if (this.$refs.asesorHomeRef) {
                // this.$refs.asesorHomeRef.getCapacitaciones();
            } else {
                console.warn('El componente asesorHomeRef no está montado');
                // Opcional: guardar en algún estado para llamar después cuando el componente esté disponible
            }
        },
        getUserRoot(dato) {
            let me = this;
            me.$vs.loading();
            this.$http
                .get(this.$server_url + "permisos/" + dato.idusuario)
                .then((result) => {
                    console.log("pedido admin screen", result.data);
                    if (result.data.length > 0) {
                        me.userRoot = true;
                    }
                    me.$vs.loading.close();
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        RecargarNotificaciones() {
            let me = this;
            me.cambiarNotificacion = !me.cambiarNotificacion;
        },
        changeCantidadMensajes(e) {
            let me = this;
            me.contadorNoLeidos = e;
        },
        getAdministradorMensaje(tr) {
            var resultado = "";
            for (let i = 0; i < tr.length; i++) {
                if (
                    tr[i].id_group == "23" ||
                    tr[i].id_group == "22" ||
                    tr[i].id_group == "1"
                ) {
                    resultado = tr[i].usuario;
                    break;
                }
            }
            return resultado;
        },

        // Función para manejar las notificaciones
        handleNotification(data) {
            // Maneja lo que quieras hacer con los datos de la notificación
            // console.log('Notificación recibida:', data);

            // Aquí puedes ejecutar cualquier lógica adicional,
            // como obtener las verificaciones cuando llega una nueva notificación
            this.ejecutarNotificacion();
            this.$refs.screenNotificacionVue.updatechat()
        },
        getNotificacionesAsesor() {
            const pusher = new Pusher('67ad293a1345b6955bf0', {
                cluster: 'us2',
                encrypted: true,
            });

            // Suscribirse al canal
            const channel = pusher.subscribe('asesor.notificacionVerificacion');

            // Escuchar el evento 'NewNotification'
            channel.bind('NewNotification', (data) => {
                console.log('Mensaje recibido:', data);
                this.ejecutarNotificacion()

            });
        },
        handleClick() {
            if (this.isExecuting) return; // Evita ejecutar si ya está en ejecución.
            this.isExecuting = true;
            this.ejecutarNotificacion();
            setTimeout(() => {
                this.isExecuting = false; // Liberar el estado de ejecución después de un breve retraso
            }, 500);
        },
        ejecutarNotificacion() {
            this.contadorNoLeidos = 0;
            this.getNotificaciones();
            this.getNotificacionesVerificaciones();
        },
        getNotificaciones() {
            let me = this;
            var tipo = 0;
            if (me.usuario.id_group == 11) {
                //envia el asesor
                tipo = 0;
            } else {
                //envia un facturador
                tipo = 1;
            }
            this.$http
                .get(this.$server_url + "verNotificacionPedidos?tipo=" + tipo)
                .then(function (res) {
                    let datos = res.data;
                    var resultado = 0;
                    if (datos.length > 0) {
                        if (me.usuario.id_group == 11) {
                            me.arregloNotificaciones = datos.filter(
                                (p) => p.id_asesor == me.usuario.idusuario
                            );
                        } else {
                            me.arregloNotificaciones = datos;
                        }
                        me.tmparregloNotificaciones = me.arregloNotificaciones;
                        //contar No vistos
                        resultado = me.arregloNotificaciones.reduce((acc, valor) => {
                            const respuesta = acc + valor.contadorVistos;
                            return respuesta;
                        }, 0);
                    }
                    me.contadorNoLeidos += resultado;
                })
                .catch(function (error) {
                    console.log(error + " error");
                });
        },
        getNotificacionesVerificaciones() {
            let me = this;
            var url = "";
            //TAMESIS HIZO PONER EL ID_GROUP
            if (me.usuario.id_group == 22) {
                url =
                    this.$server_url +
                    "notificacionesVerificaciones?idFacturador=" +
                    me.usuario.idusuario + "&id_group=" + me.usuario.id_group;
            } else if (me.usuario.id_group == 11) {
                url =
                    this.$server_url +
                    "notificacionesVerificaciones?idAsesor=" +
                    me.usuario.idusuario + "&id_group=" + me.usuario.id_group;
            } else {
                url = this.$server_url + "notificacionesVerificaciones?id_group=" + me.usuario.id_group;
            }
            this.$http
                .get(url)
                .then(function (res) {
                    me.arregloNotificacionVerificacion = res.data.filter(p => me.usuario.id_group == 1 ? p.tipo != "4" : p.tipo != "2" && p.tipo != "4");
                    me.notificacionesVerificacionesAsesor = res.data.filter(p => (p.tipo == "2" || p.tipo == "7" || p.tipo == "8" || p.tipo == "9") && me.usuario.idusuario == p.id_asesor);
                    me.notificacionesProformas = me.usuario.id_group != 11 ? res.data.filter(p => p.tipo == "4") : []
                    console.log(res.data, "NOTFY");
                })
                .catch(function (error) {
                    console.log(error + " error");
                });
        },
        verNotificacion(tr) {
            let me = this;
            if (tr.tipo == "Documento Ministerial") {
                me.viewDocumento(tr.id_created);
            }
        },
        viewDocumento(id) {
            let me = this;
            this.$http
                .get(this.$server_url + "getDocumentos/" + id)
                .then(function (res) {
                    console.log("xd", res.data.items[0]);
                    localStorage.setItem("doc", JSON.stringify(res.data.items[0]));
                    me.$router.push("/ver/viewDocument");
                })
                .catch(function (error) {
                    console.log(error + " error");
                });
        },
        getCurso() {
            let me = this;
            this.$http
                .get(
                    this.$server_url + "estudianteCurso?idusuario=" + me.usuario.idusuario
                )
                .then(function (response) {
                    me.curso = response.data;
                    me.curso.forEach((element) => {
                        this.$http
                            .get(
                                this.$server_url +
                                "tareaEstudianteRealizada?idcurso=" +
                                element.idcurso +
                                "&idusuario=" +
                                me.usuario.idusuario
                            )
                            .then(function (response) {
                                var respuesta = response.data;
                                respuesta.forEach((element) => {
                                    me.tarease.push(element);
                                });
                            })
                            .catch(function (error) {});
                        this.$http
                            .get(
                                this.$server_url +
                                "tareaEstudiantePendiente?idcurso=" +
                                element.idcurso +
                                "&idusuario=" +
                                me.usuario.idusuario
                            )
                            .then(function (response) {
                                var respuesta = response.data;
                                respuesta.forEach((element) => {
                                    me.tareasp.push(element);
                                });
                            })
                            .catch(function (error) {});
                    });
                })
                .catch(function (error) {});
        },
        f_marcarComoLeida(tr) {
            let me = this;
            let formData = new FormData();
            formData.append("marcarComoLeida", 1);
            formData.append("id", tr.id);
            formData.append("estado", 1);
            formData.append("id_usuario", me.usuario.idusuario);
            me.$http
                .post(me.$server_url + "notificaciones", formData)
                .then((res) => {
                    if (res.data.status == "0") {
                        //ocurrio un error
                        me.$vs.notify({
                            text: res.data.message,
                            color: "warning",
                            iconPack: "feather",
                            icon: "icon-alert-triangle",
                        });
                        return;
                    }
                    me.$vs.notify({
                        text: "Notificacion marcada como leida",
                        color: "success",
                        iconPack: "feather",
                        icon: "icon-check",
                    });

                    //actualizar notificacion
                    me.ejecutarNotificacion();
                })
                .catch(function (error) {
                    console.log(error + " error");
                    me.$vs.notify({
                        text: "Error al marcar notificacion como leida",
                        color: "warning",
                        iconPack: "feather",
                        icon: "icon-alert-triangle",
                    });
                });
        },
        elapsedTime(startTime) {
            const x = new Date(startTime);
            const now = new Date();
            let timeDiff = now - x;
            timeDiff /= 1000;

            const seconds = Math.round(timeDiff);
            timeDiff = Math.floor(timeDiff / 60);

            const minutes = Math.round(timeDiff % 60);
            timeDiff = Math.floor(timeDiff / 60);

            const hours = Math.round(timeDiff % 24);
            timeDiff = Math.floor(timeDiff / 24);

            const days = Math.round(timeDiff % 365);
            timeDiff = Math.floor(timeDiff / 365);

            const years = timeDiff;

            if (years > 0) {
                return `${years + (years > 1 ? " Años " : " Año ")}`;
            } else if (days > 0) {
                return `Hace ${days + (days > 1 ? " Dias " : " Dia ")}`;
            } else if (hours > 0) {
                return `Hace ${hours + (hours > 1 ? " Horas " : " Hora ")}`;
            } else if (minutes > 0) {
                return `Hace ${minutes + (minutes > 1 ? " Minutos " : " Minuto ")}`;
            } else if (seconds > 0) {
                return "Hace " + seconds + (seconds > 1 ? " segundos" : "justo ahora");
            }

            return " Justo Ahora";
        },
        // Method for creating dummy notification time
        randomDate({
            hr,
            min,
            sec
        }) {
            const date = new Date();

            if (hr) date.setHours(date.getHours() - hr);
            if (min) date.setMinutes(date.getMinutes() - min);
            if (sec) date.setSeconds(date.getSeconds() - sec);

            return date;
        },
    },
};
</script>

<style scoped>
.contador {
    background: #06d755;
    color: #fff;
    min-width: 20px;
    height: 20px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 0.75rem;
}

/**hover notificacion leida**/
.notificacion-leida {
    color: red;
    cursor: pointer;
}

.notificacion-leida:hover {
    color: black;
}
</style>
