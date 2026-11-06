<template>
<div>
    <div class="notificacion">
        <span class="hideTipo" id="notificacion" style="width: 60px;height: 40px;background-color: #59E734;padding: 10px;position: relative;border-radius: 5px;color:white;position: absolute;right: 15px;bottom: 15px;">
            <ion-icon name="checkmark-outline" style="font-size: 22px;margin-left: 12px;font-weight: bold;"></ion-icon>
        </span>
    </div>
    <div class="vs-con-loading__container" id="loadingSound" width="100%" height="100%">
        <div class="vs-loading__container">
            <div class="container">
                <div class="leftSide">
                    <!-- Search Chat -->
                    <div class="search_chat">
                        <div class="flex" style="justify-content: space-around;">
                            <div>
                                <p class="font-bold" style="text-shadow: 0px 0px 0px #000;">Chats</p>
                            </div>
                            <div>
                                <span class="cursor-pointer" @click="pedido={};arregloRespuestas = [];getNotificaciones()">
                                    <img width="20" src="https://cdn-icons-png.flaticon.com/512/2267/2267901.png" />
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="search_chat">
                        <div>
                            <input type="text" v-model="busqueda" placeholder="Buscar escuela">
                            <ion-icon name="search-outline"></ion-icon>
                        </div>
                    </div>
                    <!-- CHAT LIST -->
                    <div class="chatlist">
                        <div class="block unread" :class="{ active: pedido.id_pedido === tr.id_pedido }" v-for="(tr,key) in tmparregloNotificaciones" :key="key" @click="pedido=tr;mostrarMensajes(tr)">
                            <div class="details">
                                <div class="listHead">
                                    <h4 style="font-size: 12px!important;">{{ tr.nombreInstitucion }} </h4>
                                    <p class="time">{{ elapsedTime(tr.contadorMensajes[0].created_at) }}</p>
                                </div>
                                <div class="message_p">
                                    <p style="color: #000;">
                                        {{ tr.contadorMensajes[0].comentario }}
                                    </p>
                                    <b v-if="tr.contadorVistos > 0">{{ tr.contadorVistos }}</b>
                                </div>
                                <p class="mt-4" style="font-size: 10px!important;">Pedido #{{tr.id_pedido}}</p>
                                <p style="font-size: 10px!important;" v-if="usuario.id_group == 11">Administrador ({{ getAdministradorMensaje(tr.contadorMensajes) }})</p>
                                <p v-else style="font-size: 10px!important;">{{ tr.asesor }}</p>
                                <p style="font-size: 11px;">{{tr.ciudad}}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="rightSide">
                    <div class="header">
                        <div class="imgText" v-if="arregloRespuestas.length > 0">
                            <h4>{{ usuario.id_group == 11 ? 'Administrador': `${pedido.asesor} (${pedido.nombreInstitucion})`  }}<br></h4>
                        </div>
                        <ul class="nav_icons">
                            <li>
                                <ion-icon name="ellipsis-vertical"></ion-icon>
                            </li>
                        </ul>
                    </div>

                    <!-- CHAT-BOX -->
                    <div class="chatbox" id="tudiv">
                        <div v-for="(tr,key) in arregloRespuestas" :key="key">
                            <div class="message my_msg" v-if="tr.id_group == usuario.id_group">
                                <p>{{ tr.comentario }} <br>
                                    <span>{{ formatHorasMinutos(tr.created_at) }} ({{ formatoMes(tr.created_at)}})</span>
                                    <ion-icon name="checkmark-done-outline"></ion-icon>
                                </p>
                            </div>
                            <div class="message friend_msg" v-else>

                                <p>{{ tr.comentario }} <br>
                                    <span>{{ formatHorasMinutos(tr.created_at) }} ({{ formatoMes(tr.created_at)}})</span>
                                    <span>{{ tr.rol }}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                    <!-- CHAT INPUT -->
                    <div class="chat_input">
                        <!-- <ion-icon name="happy-outline"></ion-icon> -->
                        <!-- <ion-icon name="happy-outline"></ion-icon> -->
                        <input type="text" @keyup.enter="respuestaComentario()" v-model="respuesta" placeholder="Escriba el mensaje">
                        <!-- <ion-icon name="mic"></ion-icon> -->
                        <ion-icon name="send-outline" @click="respuestaComentario()"></ion-icon>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import io from "socket.io-client";
import $ from 'jquery'
import moment from 'moment'
import {
    type
} from "jquery";
export default {
    created() {
        let me = this;
        me.usuario = JSON.parse(localStorage.getItem("usuario"))
        let getGrupo = this.usuario.id_group;
    },
    data() {
        return {
            arregloNotificaciones: [],
            tmparregloNotificaciones: [],
            usuario: [],
            arregloRespuestas: [],
            pedido: {},
            counterDanger: false,
            respuesta: '',
            busqueda: '',
            // socket: io(process.env.socket),
            boleano: false,
            activeLoading: false,
        }
    },
    props: {
        cambiarNotificacion: {
            type: Boolean,
            default: false
        },
        datosEnviar: {
            type: Object,
            default: () => ({})
        }
    },
    watch: {
        cambiarNotificacion(results) {
            let me = this;
            me.arregloRespuestas = []
            me.pedido = {}
            me.getNotificaciones()
        },
        busqueda(results) {
            let me = this;
            me.arregloRespuestas = []
            me.tmparregloNotificaciones = []
            if (results.length == 0) {
                me.tmparregloNotificaciones = me.arregloNotificaciones
            } else {
                let datos = me.arregloNotificaciones
                me.tmparregloNotificaciones = datos.filter(p => p.nombreInstitucion.toLowerCase().includes(results));
            }
        },
        boleano(results) {
            let me = this
            if (results == true) {
                me.boleano = false
                setTimeout(() => {
                    me.createNotify()
                }, "2000");
            }
        }
    },
    mounted() {
        let me = this
        moment.locale('es')
        if (this.datosEnviar) {
            this.pedido = this.datosEnviar
            this.mostrarMensajes(this.datosEnviar)
        } else {
            me.getNotificaciones()
        }
        // try {
        //   this.socket.on('enviar', (data) => {
        //     //si el mensaje envia un asesor
        //     if(data.tipo == 'pedidos_chat'){
        //       //si el mensaje envia un asesor
        //       if(data.grupo == 11){
        //         me.getNotificaciones()
        //         if(me.pedido == undefined){
        //         }else{
        //           me.mostrarMensajes(me.pedido)
        //         }
        //         return
        //       }
        //     }
        //     //Si hay una notificacion de verificaciones
        //     if(data.tipo == 'verificaciones'){
        //       //si el mensaje envia un asesor
        //       if(data.grupo == 11){
        //         if(me.usuario.id_group == 22 || me.usuario.id_group == 23 || me.usuario.id_group == 1){
        //           me.$emit('rechargeVerificaciones',true)
        //         }
        //         return
        //       }
        //     }
        //     if(data.grupo == 22 || data.grupo == 23 || data.grupo == 25){
        //       if(me.usuario.id_group == 11 && data.id_asesor == me.usuario.idusuario){
        //         me.getNotificaciones()
        //         if(me.pedido == undefined){
        //         }else{
        //           me.mostrarMensajes(me.pedido)
        //         }

        //         return
        //       }
        //     }
        //   })
        // } catch (error) {
        //     console.log(error)
        // }
    },
    methods: {
        getAdministradorMensaje(tr) {
            var resultado = ""
            for (let i = 0; i < tr.length; i++) {
                if (tr[i].id_group == "23" || tr[i].id_group == "22" || tr[i].id_group == "1" || tr[i].id_group == "25") {
                    resultado = tr[i].usuario
                    break;
                }
            }
            return resultado;
        },
        getNotificaciones() {
            let me = this
            var tipo = 0
            if (me.usuario.id_group == 11) {
                //envia el asesor
                tipo = 0
            } else {
                //envia un facturador
                tipo = 1
            }
            this.$http.get(this.$server_url + 'verNotificacionPedidos?tipo=' + tipo)
                .then(function (res) {
                    let datos = res.data
                    var resultado = 0
                    if (datos.length > 0) {
                        if (me.usuario.id_group == 11) {
                            me.arregloNotificaciones = datos.filter(p => p.id_asesor == me.usuario.idusuario)
                        } else {
                            me.arregloNotificaciones = datos
                        }
                        me.tmparregloNotificaciones = me.arregloNotificaciones
                        //contar No vistos
                        resultado = me.arregloNotificaciones.reduce((acc, valor) => {
                            const respuesta = acc + valor.contadorVistos
                            return respuesta
                        }, 0)
                    }
                    me.$emit('ChangecantidadMensajes', resultado)
                })
                .catch(function (error) {
                    console.log(error + ' error');
                    // me.$vs.loading.close()
                })
        },
        mostrarMensajes(tr) {
            let me = this
            var tipo = 0
            me.respuesta = ''
            // me.$vs.loading()
            // this.$vs.loading({
            //     container: '#loadingSound',
            //     type: 'sound',
            //     scale: 0.6
            // });

            //me.arregloRespuestas = []
            this.$http.get(this.$server_url + 'mostrarMensajesPedido?id_pedido=' + tr.id_pedido + '&id_group=' + me.usuario.id_group)
                .then(function (res) {
                    // me.$vs.loading.close('#loadingSound > .con-vs-loading');
                    me.arregloRespuestas = res.data
                    me.bajar()
                    me.getNotificaciones()
                })
                .catch(function (error) {
                    console.log(error + ' error');
                    // me.$vs.loading.close('#loadingSound > .con-vs-loading');
                })
        },
        bajar() {
            $(document).ready(function () {
                $("#tudiv").animate({
                    scrollTop: "+=55550px"
                }, 800);
            });
        },
        respuestaComentario() {
            let me = this;
            if (me.pedido.id_pedido == undefined || me.pedido.id_pedido == null || me.pedido.id_pedido == "") {
                me.$vs.notify({
                    color: 'primary',
                    title: 'Mensaje',
                    text: 'Debe seleccionar un chat para enviar mensajes por favor'
                })
                return false;
            }
            if (me.respuesta.length >= 500) {
                me.$vs.notify({
                    color: 'primary',
                    title: 'Mensaje',
                    text: 'El motivo del ticket debe tener un maximo de 500 caracteres'
                })
                return false;
            }
            if (me.respuesta.length < 2) {
                me.$vs.notify({
                    color: 'primary',
                    title: 'Mensaje',
                    text: 'El motivo del ticket debe tener al menos 2 caracteres.'
                })
                return false;
            }
            let formData = new FormData();
            formData.append('id_pedido', me.pedido.id_pedido);
            formData.append('comentario', me.respuesta);
            formData.append('id_usuario', me.usuario.idusuario);
            formData.append('id_group', me.usuario.id_group)
            // me.$vs.loading();
            this.$http.post(this.$server_url + 'guardar_comentario', formData)
                .then(function (res) {
                    // me.$vs.loading.close()
                    me.boleano = true
                    me.getNotificaciones()
                    if (me.respuesta) {
                        let datos = {
                            id_asesor: me.pedido.id_asesor,
                            emisor: me.usuario.idusuario,
                            grupo: me.usuario.id_group,
                            tipo: "pedidos_chat"
                        }
                        // me.sendSocket(datos)
                        me.mostrarMensajes(me.pedido)
                    }
                    me.createNotify()
                    // me.$vs.notify({
                    //   color: 'primary',
                    //   iconPack: 'feather',
                    //   icon: 'icon-check',
                    //   time:18000,
                    // })

                })
                .catch(function (error) {
                    // me.$vs.loading.close()
                })
        },
        createNotify() {
            let me = this;
            const tipo = document.querySelector("#notificacion");
            if (me.boleano) {
                tipo.classList.remove("hideTipo");
                tipo.classList.toggle("showTipo");
            } else {
                tipo.classList.remove("showTipo");
                tipo.classList.toggle("hideTipo");
            }
        },
        // sendSocket(datos){
        //   try {
        //     this.socket.emit("enviar", datos);
        //     } catch (error) {
        //       console.log(error)
        //     }
        // },
        formatHorasMinutos(fecha) {
            let me = this;
            const setFecha = moment(fecha).format('HH:mm')
            return setFecha
        },
        formatoMes(fecha) {
            const setFecha = moment(fecha).format('MMMM')
            const mes = setFecha.replace(/^\w/, (c) => c.toUpperCase()).substring(0, 3)
            const year = moment(fecha).format('YYYY')
            const day = moment(fecha).format('DD')
            const resultado = year + "-" + mes + "-" + day
            return resultado
        },
        elapsedTime(startTime) {
            const x = new Date(startTime)
            const now = new Date()
            let timeDiff = now - x
            timeDiff /= 1000

            const seconds = Math.round(timeDiff)
            timeDiff = Math.floor(timeDiff / 60)

            const minutes = Math.round(timeDiff % 60)
            timeDiff = Math.floor(timeDiff / 60)

            const hours = Math.round(timeDiff % 24)
            timeDiff = Math.floor(timeDiff / 24)

            const days = Math.round(timeDiff % 365)
            timeDiff = Math.floor(timeDiff / 365)

            const years = timeDiff

            if (years > 0) {
                return `${years + (years > 1 ? ' Años ' : ' Año ')}`
            } else if (days > 0) {
                return `Hace ${days + (days > 1 ? ' Dias ' : ' Dia ')}`
            } else if (hours > 0) {
                return `Hace ${hours + (hours > 1 ? ' Horas ' : ' Hora ')}`
            } else if (minutes > 0) {
                return `Hace ${minutes + (minutes > 1 ? ' Minutos ' : ' Minuto ')}`
            } else if (seconds > 0) {
                return 'Hace ' + seconds + (seconds > 1 ? ' segundos' : 'justo ahora')
            }

            return ' Justo Ahora'
        },
        updatechat(data) {
            let me = this
            if (me.pedido) {
                me.mostrarMensajes(me.pedido)
            } else {
                me.getNotificaciones()
            }
        },
    }
}
</script>

<style scoped>
/*SHOW / SHOW*/
.showTipo {
    transition: 1s ease all;
    opacity: 1;
    transform: translateY(0%);
}

.hideTipo {
    opacity: 0;
    position: relative;
    transition: 1s ease all;
    transform: translateY(-30%);
}

.vs-notifications {
    max-width: 50px !important;
}

.vs-noti-bottom-right {
    max-width: 50px !important;
}

.vs-noti-primary {
    max-width: 50px !important;
}

.activeNoti {
    max-width: 50px !important;
}

.content-noti {
    max-width: 50px !important;
}

.contenedor {
    position: relative;
    display: inline-block;
    text-align: center;
}

.texto-encima {
    position: absolute;
    top: 2px;
    right: -8px;
    color: white;
    z-index: 1000;
    font-weight: bold;
    font-size: 20px;
    text-shadow: 1px 1px 2px #000;
    background-color: red;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    padding: 1px;
}

/* .centrado{
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
} */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: Arial, Helvetica, sans-serif;
}

body {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: linear-gradient(#009688 0%,
            #009688 130px,
            #d9dbd5 130px,
            #d9dbd5 100%);
}

.container {
    position: relative;
    width: 100%;
    max-width: 100%;
    height: calc(100vh - 200px);
    background: #fff;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.06), 0 2px 5px 0 rgba(0, 0, 0, 0.06);
    display: flex;
}

.container .leftSide {
    position: relative;
    flex: 30%;
    background: #fff;
    border-right: 1px solid rgba(0, 0, 0, 0.2);
}

.container .rightSide {
    position: relative;
    flex: 70%;
    background: #e5ddd5;
}

.container .rightSide::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: url("../../../assets/images/home/pedidos/pattern.png");
    opacity: 0.06;
}

.header {
    position: relative;
    width: 100%;
    height: 60px;
    background: #ededed;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 15px;
}

.userimg {
    position: relative;
    width: 40px;
    height: 40px;
    overflow: hidden;
    border-radius: 50%;
    cursor: pointer;
}

.cover {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.nav_icons {
    display: flex;
}

.nav_icons li {
    display: flex;
    list-style: none;
    cursor: pointer;
    color: #51585c;
    font-size: 1.5em;
    margin-left: 22px;
}

.search_chat {
    position: relative;
    width: 100%;
    height: 60px;
    background: #f6f6f6;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 15px;
}

.search_chat div {
    width: 100%;
}

.search_chat div input {
    width: 100%;
    outline: none;
    border: none;
    background: #fff;
    padding: 6px;
    height: 38px;
    border-radius: 30px;
    font-size: 14px;
    padding-left: 40px;
}

.search_chat div input::placeholder {
    color: #bbb;
}

.search_chat div ion-icon {
    position: absolute;
    left: 30px;
    top: 20px;
    font-size: 1.2em;
}

.chatlist {
    position: relative;
    height: calc(100% - 110px);
    overflow: auto;
}

.chatlist .block {
    position: relative;
    width: 100%;
    display: flex;
    align-items: center;
    padding: 15px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
    cursor: pointer;
}

.chatlist .block.active {
    background: #ebebeb;
}

.chatlist .block:hover {
    background: #f5f5f5;
}

.chatlist .block .imgBox {
    position: relative;
    min-width: 45px;
    height: 45px;
    overflow: hidden;
    border-radius: 50%;
    margin-right: 10px;
    width: 50px;
}

.chatlist .block .details {
    position: relative;
    width: 100%;
}

.chatlist .block .details .listHead {
    display: flex;
    justify-content: space-between;
    margin-bottom: 5px;
}

.chatlist .block .details .listHead h4 {
    font-size: 13px;
    font-weight: 600;
    color: #111;
}

.chatlist .block .details .listHead .time {
    font-size: 0.75em;
    color: #aaa;
}

.chatlist .block .details .listHead .time {
    color: #111;
}

.chatlist .block.unread .details .listHead .time {
    color: #06d755;
}

.message_p {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.message_p b {
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

.message_p p {
    color: #aaa;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    font-size: 0.9em;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 11px;
}

.imgText {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
}

.imgText h4 {
    font-weight: 500;
    line-height: 1.2em;
    margin-left: 15px;
    font-size: 14px;
}

.imgText h4 span {
    font-size: 0.8em;
    color: #555;
}

/* CHAT BOX */
.chatbox {
    position: relative;
    width: 100%;
    height: calc(100% - 120px);
    padding: 50px;
    overflow-y: auto;
}

.message {
    position: relative;
    display: flex;
    width: 100%;
    margin: 5px 0;
    min-width: 100px !important;
}

.message p {
    position: relative;
    right: 0;
    text-align: right;
    max-width: 65%;
    padding: 12px;
    background: #dcf8c8;
    border-radius: 10px;
    font-size: 0.9em;
}

.message p::before {
    content: "";
    position: absolute;
    top: 0;
    right: -12px;
    width: 20px;
    height: 20px;
    background: linear-gradient(135deg,
            #dcf8c6 0%,
            #dcf8c6 50%,
            transparent 50%,
            transparent);
}

.message p span {
    display: block;
    margin-top: 5px;
    font-size: 0.85em;
    opacity: 0.5;
}

.my_msg {
    justify-content: flex-end;
}

.friend_msg {
    justify-content: flex-start;
}

.friend_msg p {
    background: #fff;
    text-align: left;
}

.message.friend_msg p::before {
    content: "";
    position: absolute;
    top: 0;
    left: -12px;
    width: 20px;
    height: 20px;
    background: linear-gradient(225deg,
            #fff 0%,
            #fff 50%,
            transparent 50%,
            transparent);
}

.chat_input {
    position: relative;
    width: 100%;
    height: 60px;
    background: #f0f0f0;
    padding: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.chat_input ion-icon {
    cursor: pointer;
    font-size: 1.8em;
    color: #51585c;
}

.chat_input ion-icon:nth-child(1) {
    margin-right: 15px;
}

.chat_input input {
    position: relative;
    width: 90%;
    margin: 0 20px;
    padding: 10px 20px;
    border: none;
    outline: none;
    border-radius: 30px;
    font-size: 1em;
}

.block.active {
  background-color: #dbeafe; /* azul claro */
  border-left: 4px solid #3b82f6; /* azul intenso */
}
</style>
