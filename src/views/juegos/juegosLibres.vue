<template>
    <div>
        <vx-card>
            <div class="vx-row">
                <div class="vx-col w-1/2 md:w-1/3 xl:w-1/4 mt-3">
                    <vx-card class="text-center">
                        <div style=" min-height: 350px;">
                            <div>
                                <img class="responsive card-img-top" src="https://cdn-icons-png.flaticon.com/512/4072/4072061.png" >
                            </div>
                            <p class="font-bold mt-3">Juego de cartas</p>
                            <p><small>Selecciona una carta y juega con tus amigos!</small></p>
                        </div>
                        <vs-divider></vs-divider>
                        <center>
                            <vx-tooltip style="display:inline-block" title="'Ver juego" color="success">
                                <vs-button style="display:inline-block" radius icon-pack="feather" icon="icon-eye" color="success" @click="verJuegoCartas(item)"> </vs-button> &nbsp;
                            </vx-tooltip>
                            <!-- <vx-tooltip style="display:inline-block" :title="'Editar '+ item.nombre_tipo_juego" color="warning">
                                <vs-button style="display:inline-block" radius icon-pack="feather" icon="icon-edit" color="warning" @click="editarTipoJuego(item)"> </vs-button>
                            </vx-tooltip> -->
                        </center>
                    </vx-card>
                </div>
            </div>
        </vx-card>
    
    </div>
    </template>
    
    <script>
    import Vue from 'vue'
    import axios from 'axios'
    import vSelect from 'vue-select'
    import 'vue-select/dist/vue-select.css';
    Vue.use(axios)
    export default {
        components: {
            'v-select': vSelect,
        },
        data() {
            return {
                activePrompt: false,
                activePrompt2: false,
                val: '',
                idjuego: '',
                valMultipe: {
                    value1: '',
                    value2: ''
                },
                select: [],
                juegos: [],
                modalAgregar: false,
                tipoJuego: {
                    'id_tipo_juego': '',
                    'nombre_tipo_juego': '',
                    'descripcion_tipo_juego': '',
                    'imagen_juego': '',
                    'estado': 1,
                },
                bytes: 1048576,
                limiteMegas: 1,
                porcentaje: '',
                pesoArchivo: '',
                muyPesado: '',
                msj: '',
                titulo_modal:'',
                txt_boton:'',
                usuario:'',
                grupo_usuario:'',
            }
        },
        computed: {},
        mounted() {
            let me = this;
            me.usuario =  JSON.parse(localStorage.getItem('usuario'));
            me.grupo_usuario =  me.usuario.id_group;
            // this.getJuegos()
        },
        methods: {
            async getJuegos() {
                let me = this;
                me.$vs.loading()
                this.$http.get(this.$server_url+'tipoJuegos')
                    .then(function (response) {
                        me.juegos = response.data
                        me.$vs.loading.close()
                    })
                    .catch(function (error) {
                        me.$vs.loading.close()
                    })
            },
            verJuegoCartas(){
                let me = this;
                me.$router.push('/juegos/cartas')
            },
            crearJuego(item) {
                localStorage.id_tipo_juego = item.id_tipo_juego
                localStorage.nombre_tipo_juego = item.nombre_tipo_juego
                this.$router.push('/contenido_juego');
            },
            obtenerImagen(e) {
                let me = this;
                me.file = e.target.files[0];
                // console.log(me.file)
                me.muyPesado = false;
                me.pesoArchivo = (me.file.size / me.bytes).toFixed(2);
                if (me.pesoArchivo > me.limiteMegas) {
                    me.muyPesado = true;
                    me.msj = 'El archivo que intenta, pesa ' + me.pesoArchivo + ' mb. y excede el peso permitido, favor verifique';
                }
            },
            abrirModalAgregar(){
                let me = this;
                me.titulo_modal = 'Agregar tipo de juego';
                me.txt_boton = 'Guardar';
                me.modalAgregar = true;
            },
            editarTipoJuego(item) {
                let me = this;
                me.titulo_modal = 'Editar tipo de juego';
                me.txt_boton = 'Editar';
                me.tipoJuego.id_tipo_juego = item.id_tipo_juego
                me.tipoJuego.nombre_tipo_juego = item.nombre_tipo_juego
                me.tipoJuego.descripcion_tipo_juego = item.descripcion_tipo_juego
                me.tipoJuego.imagen_juego = item.imagen_juego
                me.tipoJuego.estado = item.estado
                me.modalAgregar = true;
            },
            agregarTipoJuego() {
                let me = this;
                console.log(me.tipoJuego,me.file)
                // return
                if (me.muyPesado) {
                    me.$vs.notify({
                        text: 'El archivo es muy pesado, favor verifique',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                    return;
                }
                me.modalAgregar = false;
                if (me.tipoJuego.nombre_tipo_juego == "" || me.tipoJuego.descripcion_tipo_juego == "") {
                    me.$vs.notify({
                        text: 'Debe completar todos los campos antes de continuar',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                    return
                }
                let formData = new FormData();
                formData.append('imagen_juego', me.file);
                formData.append('id_tipo_juego', me.tipoJuego.id_tipo_juego);
                formData.append('nombre_tipo_juego', me.tipoJuego.nombre_tipo_juego);
                formData.append('descripcion_tipo_juego', me.tipoJuego.descripcion_tipo_juego);
                formData.append('estado', me.tipoJuego.estado);
                axios.post(this.$data_url+'api/tipoJuegos', formData)
                    .then(function (response) {
                        // console.log(response.data )
                        me.tipoJuego.imagen_juego = response.data.imagen_juego
                        me.file = '';
                        window.$("#file").val('');
                        me.$vs.notify({
                            text: 'Tipo juego registrado correctamente ',
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-check'
                        })
                        me.getJuegos();
                        me.$vs.loading.close();
                    })
                    .catch(function (error) {
                        me.$vs.loading.close()
                    })
            }
        },
    }
    </script>
    <style lang="css">
    .alto-img{
        width: 270px;
        height: 270px;
    }
        
    </style>