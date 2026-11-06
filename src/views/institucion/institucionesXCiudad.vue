<template>
<div>
    <div class="vx-row mb-4 mt-4">
        <div class="vx-col sm:w-1/3 w-full">
            <span>Ciudad</span>
        </div>
        <div class="vx-col sm:w-2/3 w-full">
          <div>
            <v-select @input="filtrarInstituciones()" :options="arregloCiudad" :reduce="arregloCiudad => arregloCiudad" label="nombre" class="w-full" v-model="ciudadSelect" />
            </div>
            <div v-if="ciudadSelect == null || ciudadSelect.idciudad == null ">
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
            </div>
        </div>
    </div>
    <div v-if="instituciones.length > 0">
      <vs-button color="success" class="mb-0 p-3" @click="f_exportar"><i class="fa-solid fa-download"></i> Exportar</vs-button>
    </div>
    <div class="vx-row mb-4">
        <vs-table stripe max-items="50" v-if="instituciones.length > 0" style="width: 100%;" search pagination :data="instituciones">
            <template slot="header">
                <div class="vx-row">
                    <div class="vx-col w-full m-3">
                        Cantidad: {{instituciones.length}}
                    </div>
                </div>
            </template>
            <template slot="thead">
                <vs-th sort-key="idInstitucion">#</vs-th>
                <vs-th sort-key="nombreInstitucion">Institución (asesor)</vs-th>
                <vs-th sort-key="codigo_institucion_milton">id Facturación</vs-th>
                <vs-th sort-key="region">Region</vs-th>
                <vs-th sort-key="nombre">Accion</vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td :data="data[indextr].institucion.idInstitucion ">
                        {{data[indextr].institucion.idInstitucion }}
                    </vs-td>
                    <vs-td :data="data[indextr].institucion.nombreInstitucion">
                        {{data[indextr].institucion.nombreInstitucion}}<br>
                        <div v-if="data[indextr].institucion.nombre_asesor == null &&  data[indextr].institucion.apellido_asesor == null">
                            <small> <i style="color:red;">No existe asesor </i></small><br>
                        </div>
                        <div v-else>
                            <small> <i>{{data[indextr].institucion.nombre_asesor}} {{data[indextr].institucion.apellido_asesor}} </i></small><br>
                        </div>
                        <small>{{data[indextr].institucion.fecha_registro}} </small>
                    </vs-td>
                    <vs-td :data="data[indextr].institucion.codigo_institucion_milton">
                        <span :class="tr.institucion.codigo_institucion_milton == '22507' ? 'texto-grande-1':'' ">{{data[indextr].institucion.codigo_institucion_milton}} </span><br />
                        <small class="text-danger" v-if="tr.institucion.codigo_institucion_milton == 22507">Hay que cambiar</small>
                    </vs-td>
                    <vs-td :data="data[indextr].institucion.nombreregion">
                        {{data[indextr].institucion.nombreregion}} <br>
                        <small>{{data[indextr].institucion.ciudad}}</small>
                        <div v-if="tr.periodo.length > 0">
                          <br>
                          <span>{{ tr.periodo[0].periodo }}</span>
                        </div>
                        <div v-else>
                          <p><vs-chip color="danger">Sin período</vs-chip></p>
                        </div>
                    </vs-td>
                    <vs-td>
                        <div class="flex">
                            <vs-button icon="code" size="small" color="dark" @click="getTipoVenta(tr);" class="ml-4">Ver revisión venta</vs-button>
                            <vs-button icon="edit" size="small" color="warning" @click="institucionSend = tr.institucion.idInstitucion;getEditar(tr.institucion.idInstitucion)" class="ml-4"></vs-button>
                        </div>
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>
    </div>
    <vs-popup fullscreen title="titulo" :active.sync="modalEditarInstitucion" @close="f_closeModal()" v-if="modalOk">
        <AddInstitucion :id="institucionSend" @update_institucion_x_ciudad="f_update_institucion()" xciudad="ok" />
    </vs-popup>
    <vs-popup class="holamundo" fullscreen :title="titulo" :active.sync="popupTipoVenta">
        <RevisionVentaVue v-if="popupTipoVenta" :pedido="pedido"/>
    </vs-popup>
</div>
</template>

<script>
import vSelect from 'vue-select'
import AddInstitucion from './addInstitucion.vue';
import RevisionVentaVue from '../codigos/components/utils/RevisionVenta.vue';
import Codigosmix from "@/mixins/Codigosmix";
export default {
    mixins: [Codigosmix],
    components: {
        "v-select": vSelect,
        AddInstitucion,
        RevisionVentaVue,
    },
    data() {
        return {
            arregloCiudad: [],
            ciudadSelect: {},
            instituciones: [],
            permisoRoot: false,
            usuario: [],
            popupTipoVenta: false,
            informacion: [],
            tmpinformacion: [],
            nombreInstitucion: '',
            institucion_id: '',
            titulo: '',
            modalEditarInstitucion: false,
            modalOk: false,
            institucionSend:0,
            pedido:{},
            headers:[],
            fieldKeys:[],
            nombrearchivo:'',
        }
    },
    mounted() {
        let me = this
        me.usuario = JSON.parse(localStorage.getItem('usuario'));
        me.getUserRoot()
    },
    methods: {
        listaCiudades() {
            let me = this
            this.$http.get(this.$server_url + 'ciudad')
                .then(res => {
                    me.arregloCiudad = res.data;
                })
                .catch(function (error) {
                    console.log(error)
                })
        },
        getUserRoot() {
            let me = this;
            this.$http.get(this.$server_url + 'permisos?permiso=yes&usuario_id=' + me.usuario.idusuario)
                .then(function (res) {
                    // console.log(res.data,me.usuario.idusuario)
                    if (res.data.status == '1') {
                        me.permisoRoot = true
                        me.listaCiudades();
                    } else {
                        me.permisoRoot = false
                        me.listaCiudades();
                    }
                })
                .catch(function (error) {
                    console.log(error + ' error');
                })
        },
        filtrarInstituciones() {
          let me = this;
          if (me.ciudadSelect == null) return
          me.instituciones = []
          me.$vs.loading()
          this.$http.get(this.$server_url + 'institucionesX_Ciudad?ciudad_id='+me.ciudadSelect.idciudad)
            .then(res => {
                console.log(res.data)
                me.instituciones = res.data;
                me.$vs.loading.close()
            })
            .catch(function (error) {
                console.log(error);
            })
        },
        getTipoVenta(tr) {
            let me = this;
            if(tr.periodo.length == 0){
                me.$vs.notify({
                text:'No hay período asignado',
                color:'success',
                iconPack: 'feather',
                icon:'icon-check'})
                return
            }
            me.pedido.nombreInstitucion = tr.institucion.nombreInstitucion
            me.pedido.idInstitucion     = tr.institucion.idInstitucion
            me.pedido.periodo           = tr.periodo[0].periodo
            me.pedido.periodo_id        = tr.periodo[0].periodo_id
            me.titulo               = 'Detalle de venta de ' + me.pedido.nombreInstitucion
            me.popupTipoVenta       = true;
        },
        getEditar(item) {
            let me = this;
            localStorage.setItem('dato_Institucion', item);
            me.modalOk = true;
            me.modalEditarInstitucion = true;
        },
        f_closeModal() {
            let me = this;
            me.modalEditarInstitucion = false;
            me.modalOk = false;
        },
        f_update_institucion() {
            let me = this;
            console.log(me.ciudadSelect)
            me.filtrarInstituciones();
            me.f_closeModal();
        },
        f_exportar() {
          let me = this;
          me.nombrearchivo = 'Reporte_Instituciones_'+this.ciudadSelect.nombre
          let arrayExportar = this.instituciones.map(element => {
            let cal = {};
            cal.nombreInstitucion = element.institucion.nombreInstitucion;
            cal.nombre_asesor = element.institucion.nombre_asesor;
            cal.ciudad = element.institucion.ciudad;
            cal.nombreregion = element.institucion.nombreregion;
            cal.periodo = element.periodo.length > 0 ? element.periodo[0].periodo : '';
            return cal;
          });
          me.headers = ['Institución','Asesor','Ciudad','Region','Periodo']
          me.fieldKeys = ['nombreInstitucion','nombre_asesor','ciudad','nombreregion','periodo']
          me.m_exportTodo(me.headers, me.fieldKeys, arrayExportar, me.nombrearchivo, 0);
        }
    },
}
</script>

<style scoped>
.texto-grande-1 {
    font-size: medium;
    color: red;
    font-weight: 800;
}
</style>
