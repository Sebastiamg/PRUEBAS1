<template>
    <div class="vx-col sm:w-1/1 w-full">
        <!-- <pre>{{ ObjectSelect }}</pre> -->
        <div class="vx-row">
            <div class="vx-col w-full">
                <div>Nombres</div>
                <vs-input type="text" class="inputx w-full mb-6" v-model="sendEmpresa.nombre" placeholder="Nombre de la empresa" />
            </div>
            <div class="vx-col w-full">
                <div>Descripción corta</div>
                <vs-input type="text" class="inputx w-full mb-6" v-model="sendEmpresa.descripcion_corta" placeholder="Descripción corta" />
            </div>
            <div class="vx-col w-full">
                <div>Representante legal</div>
                <vs-input type="text" class="inputx w-full mb-6" v-model="sendEmpresa.representante" placeholder="Representante legal de la empresa" />
            </div>
            <div class="vx-col w-full">
                <div>Dirección</div>
                <vs-input type="text" class="inputx w-full mb-6" v-model="sendEmpresa.direccion" placeholder="Dirección de la empresa" />
            </div>
            <div class="vx-col w-full sm:w-1/2 md:w-1/2">
                <div>Ruc</div>
                <vs-input type="text" class="inputx w-full mb-6" v-model="sendEmpresa.ruc" placeholder="Ruc" />
            </div>
            <div class="vx-col w-full sm:w-1/2 md:w-1/2">
                <div>Email</div>
                <vs-input type="text" class="inputx w-full mb-6" v-model="sendEmpresa.email" placeholder="Email" />
            </div>
            <div class="vx-col w-full sm:w-1/2 md:w-1/2">
                <div>Teléfono</div>
                <vs-input type="text" class="inputx w-full mb-6" v-model="sendEmpresa.telefono" placeholder="Teléfono" />
            </div>
            <div class="vx-col w-full sm:w-1/2 md:w-1/2">
                <div>% Acta/Guías</div>
                <vs-input type="number" class="inputx w-full mb-6" v-model="sendEmpresa.porcentaje_acta_guias" placeholder="Porcentaje acta guías" min="0" max="100" />
            </div>
            <div class="vx-col w-full sm:w-1/2 md<w-1/2">
                <div>Tipo</div>
                <v-select class="mb-4 w-full" v-model="sendEmpresa.tipo" :options="tipoActividad" label="nombre" :reduce="tipoActividad => tipoActividad.id" />
            </div>
            <div class="vx-col w-full sm:w-1/2 md:w-1/2">
                <div>Estado</div>
                <vs-radio v-model="sendEmpresa.estado" class="ml-2" vs-name="radiosTipoestado" vs-value="1">Activa</vs-radio>
                <vs-radio v-model="sendEmpresa.estado" class="ml-2" vs-name="radiosTipoestado" vs-value="0">Inactiva</vs-radio>
            </div>
            <div class="vx-col w-full sm:w-1/2 md:w-1/2">
                <div>Token Local</div>
                <vs-input type="text" class="inputx w-full mb-6" v-model="sendEmpresa.token_local" placeholder="Token Local" />
            </div>
            <div class="vx-col w-full sm:w-1/2 md:w-1/2">
                <div>Token Producción</div>
                <vs-input type="text" class="inputx w-full mb-6" v-model="sendEmpresa.token_prod" placeholder="Token Producción" />
            </div>
            <div class="vx-col w-full sm:w-1/2 md:w-1/2">
                <div>Contifico token</div>
                <vs-input type="text" class="inputx w-full mb-6" v-model="sendEmpresa.contifico_api_key" placeholder="Contifico token" />
            </div>
            <div class="vx-col w-full sm:w-1/2 md:w-1/2">
                <div>Contifico Pos token</div>
                <vs-input type="text" class="inputx w-full mb-6" v-model="sendEmpresa.contifico_pos_token" placeholder="Contifico Pos token" />
            </div>
            <div class="vx-col w-full sm:w-1/2 md:w-1/2 mb-6">
                <div class="mb-3">Entorno Perseo</div>
                <div class="perseo-env-container">
                    <div class="env-option mb-3" :class="{'env-active': sendEmpresa.perseo_enviroment == 0}">
                        <vs-radio v-model="sendEmpresa.perseo_enviroment" vs-name="radiosPerseoEnv" :vs-value="0">
                            <span class="flex items-center">
                                <i class="fa-solid fa-laptop-code mr-2" style="color: #7367f0;"></i>
                                <span class="font-medium">Local</span>
                            </span>
                        </vs-radio>
                    </div>
                    <div class="env-option" :class="{'env-active': sendEmpresa.perseo_enviroment == 1}">
                        <vs-radio v-model="sendEmpresa.perseo_enviroment" vs-name="radiosPerseoEnv" :vs-value="1">
                            <span class="flex items-center">
                                <i class="fa-solid fa-cloud mr-2" style="color: #28c76f;"></i>
                                <span class="font-medium">Producción</span>
                            </span>
                        </vs-radio>
                    </div>
                </div>
            </div>

        </div>
        <!--upload file-->
        <div class="vx-row">
          <div class="w-full p-2">
            <div v-if="id == 0">
              <EmpresaUploadVue :ObjectPadre="sendEmpresa" :id="id" @f_creado="changeHandleCreate"/>
            </div>
            <div v-else>
              <EmpresaUploadVue :ObjectPadre="sendEmpresa" v-if="sendEmpresa.nombre" :id="id" @f_creado="changeHandleCreate"/>
            </div>
          </div>
        </div>
    </div>
    </template>

    <script>
    const EmpresaUploadVue = () => import('./components/EmpresaUpload.vue');
    import vSelect from 'vue-select'
    export default {
        components: {
          'v-select': vSelect,
          EmpresaUploadVue,
        },
        data() {
            return {
                sendEmpresa:{
                    nombre:'',
                    descripcion_corta:'',
                    representante:'',
                    direccion:'',
                    ruc:'',
                    email:'',
                    telefono:'',
                    porcentaje_acta_guias:0,
                    secuencial:'',
                    estado:1,
                    tipo:0,
                    img_base64:'',
                    archivo:'',
                    url:'',
                    facturas:0,
                    notas:0,
                    token_local:'',
                    token_prod:'',
                    contifico_api_key:'',
                    contifico_pos_token:'',
                    perseo_enviroment:0,
                },
                ocultarBASE64: true,
                tipoActividad: [{
                    "id": 0,
                    "nombre": "Matriz"
                }, {
                    "id": 1,
                    "nombre": "Sucursal"
                }],
                color_boton: 'success',
            };
        },
        props: {
            id:{
                type:Number,
                default:0
            },
            ObjectSelect: {
                type: Object,
                default: function(){
                    return {}
                }
            },
            data_conf: {
                type: Object,
                default: ''
            }
        },
        created() {

        },
        mounted() {
            let me = this;
            me.start()
        },
        methods: {
          changeHandleCreate(e){
            this.$emit('f_creado', e);
          },
          start() {
            let me = this;
            //save
            if(me.id > 0 ){
              me.sendEmpresa = {
                nombre:             me.ObjectSelect.nombre,
                descripcion_corta:  me.ObjectSelect.descripcion_corta,
                representante:      me.ObjectSelect.representante,
                direccion:          me.ObjectSelect.direccion,
                ruc:                me.ObjectSelect.ruc,
                email:              me.ObjectSelect.email,
                telefono:           me.ObjectSelect.telefono,
                porcentaje_acta_guias: me.ObjectSelect.porcentaje_acta_guias || 0,
                secuencial:         me.ObjectSelect.secuencial,
                estado:             me.ObjectSelect.estado,
                tipo:               me.ObjectSelect.tipo,
                img_base64:         me.ObjectSelect.img_base64,
                archivo:            me.ObjectSelect.archivo,
                url:                me.ObjectSelect.url,
                facturas:           me.ObjectSelect.facturas,
                notas:              me.ObjectSelect.notas,
                token_local:        me.ObjectSelect.token_local,
                token_prod:         me.ObjectSelect.token_prod,
                contifico_api_key:  me.ObjectSelect.contifico_api_key,
                contifico_pos_token: me.ObjectSelect.contifico_pos_token,
                perseo_enviroment:  me.ObjectSelect.perseo_enviroment || 0,
              }
            }
            //edit
            else{
              me.sendEmpresa = {
                nombre:'',
                descripcion_corta:'',
                representante:'',
                direccion:'',
                ruc:'',
                email:'',
                telefono:'',
                porcentaje_acta_guias:0,
                secuencial:'',
                estado:1,
                tipo:0,
                img_base64:'',
                archivo:'',
                url:'',
                facturas:'0',
                notas:'0',
                token_local:'',
                token_prod:'',
                contifico_api_key:'',
                contifico_pos_token:'',
                perseo_enviroment:0,
              }
            }
          },
        }
    };
    </script>

    <style scoped>
    .perseo-env-container {
        padding: 15px;
        background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        border-radius: 12px;
        border: 1px solid #e0e0e0;
    }
    .env-option {
        padding: 10px 16px;
        border-radius: 8px;
        transition: all 0.3s ease;
    }
    .env-option:hover {
        background: rgba(115, 103, 240, 0.1);
    }
    .env-active {
        background: rgba(115, 103, 240, 0.15);
        box-shadow: 0 2px 8px rgba(115, 103, 240, 0.2);
    }
    .mb-3 {
        margin-bottom: 0.75rem;
    }
    </style>
