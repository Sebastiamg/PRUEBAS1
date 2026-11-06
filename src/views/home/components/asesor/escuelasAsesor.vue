<template>
  <div>
    <vs-card v-if="usuario.id_group == 11 || usuario.id_group == 1"> 
      <div>
        <vs-table max-items="10" search pagination :data="escuelas">
          <template slot="header">
            <ul class="leftx" style="display:flex;flex-direction: row;">
              <li class="ml-2">
              <vs-radio v-model="region" vs-name="radios1" @input="getEscuelas()" vs-value="1">Sierra</vs-radio>
              </li>
              <li class="ml-2">
              <vs-radio v-model="region" vs-name="radios1" @input="getEscuelas()" vs-value="2">Costa</vs-radio>
              </li>
              <li>
                <vs-chip class="ml-3" transparent color="danger" style="margin-top:-3px;">
                  Cantidad {{ escuelas.length }}
                </vs-chip>
              </li>
            </ul>
          </template>
          <template slot="thead">
            <vs-th>Instituciones</vs-th>
            <vs-th>Ciudad</vs-th>
            <vs-th>Período</vs-th>
            <vs-th>Acciones</vs-th>
          </template>
          <template slot-scope="{data}">
            <vs-tr :key="indextr" v-for="(tr, indextr) in data">
              <vs-td>
                  {{data[indextr].label}}<br>
                  <vs-chip color="warning" class="mt-1" v-if="tr.visitas > 0">
                      Visitas Pendientes
                  </vs-chip>
              </vs-td>
              <vs-td>
                  {{data[indextr].nombre_ciudad}}<br>
              </vs-td>
              <vs-td>
                  <p> {{ tr.periodo }}</p>
                    <vs-chip :color="tr.estado == 1?'primary':'danger'">
                      {{tr.estado == 1 ?'Activo':'No activo'}}
                  </vs-chip> 
              </vs-td>
              <vs-td>
                <div style="display:flex;">
                  <vx-tooltip text="Activar a período actual" position="top" color="danger">
                    <vs-button @click="institucion = tr;getPeriodos();" color="dark" icon-pack="feather" type="line" icon="icon-aperture">Activar a período actual</vs-button>
                  </vx-tooltip>
                  <vx-tooltip text="Seguimiento de la institución" position="top" color="danger">
                    <vs-button radius @click ="SeguimientoInstitucion(tr)" color="success" class="ml-2" type="line" icon="event_note"></vs-button>
                  </vx-tooltip>
                </div>
              </vs-td>   
            </vs-tr>
          </template>
        </vs-table>   
      </div>
      <!--MODALES-->
      <!--MODAL PARA CAMBIAR DE PERIODO-->
      <vs-popup classContent="popup-example" title="Actualizar a periodo actual" :active.sync="popupActualizarPeriodo">
        <vx-card v-if="popupActualizarPeriodo">
          <p><b>Insitución:</b>       {{ institucion.label }}  </p>
          <p class="font-bold text-2xl text-warning mt-2">Estas seguro de cambiar al periodo {{ periodoSelect[0].periodoescolar }}?</p>
          <div class="flex justify-center mt-2">
            <vs-button class="mr-3 mb-2" @click="changePeriodo()">Si, deseo cambiar</vs-button>
            <vs-button color="warning" type="border" class="mb-2" @click="popupActualizarPeriodo = false;">Cancelar</vs-button>
          </div>
        </vx-card>
      </vs-popup>
    </vs-card>
  </div>
</template>
<script>
export default {
    data() {
        return{
          usuario:[],
          escuelas:[],
          region:'2',
          isAdmin:'',
          asesorDesdeAdmin:'',
          periodoSelect:[],
          popupActualizarPeriodo:false,
          institucion:{},
        }
    },
    created() {
      let me = this;
      me.usuario = JSON.parse(localStorage.getItem("usuario"))
      me.isAdmin = localStorage.getItem("adminSeguimiento")
      me.getEscuelas(); 
    },
    methods:{
      //cantidad de escuelas del asesor
      async getEscuelas() {
        let me = this;
        if(me.isAdmin == "yes"){
          me.asesorDesdeAdmin = localStorage.getItem("institucion_seguimiento_asesor_id") 
        }else{
          me.asesorDesdeAdmin = me.usuario.cedula
        }
        this.$http.get(this.$server_url+'escuelasAsesor?cedula=' + me.asesorDesdeAdmin+'&region='+me.region+'&individual=yes'+'&porRegion=yes')
          .then(function (response) {
            me.escuelas = response.data;      
          })
          .catch(function (error) {       
          })
      },
      getPeriodos(){
        let me = this
        me.$vs.loading()
        me.periodoSelect = []
        this.$http.get(this.$server_url+'get_periodos_pedidos')
        .then(res => {
          me.$vs.loading.close()
          let datos = res.data
          if(datos.length == 0 ){
            me.$vs.notify({
            text:'No existe períodos para activar Comuniquese con soporte',
            color:'warning',
            iconPack: 'feather',
            icon:'icon-check',
            time:5000,
            })
            return
          }
          //obtener el perido activo de la region para activar a la escuela en ese periodo
          if(datos.length > 0){
            me.periodoSelect = datos.filter(p => p.cambiar_periodo == 1 && p.region_idregion == me.region)
            //si no existe el periodo activo para la region para poder cambiar
            if( me.periodoSelect.length == 0 ){
              me.$vs.notify({
              text:'No existe un período configurado para activar Comuniquese con soporte',
              color:'warning',
              iconPack: 'feather',
              icon:'icon-check',
              time:5000,
              })
              return
            }
            //si existe mas de un periodo activo para la region
            if( me.periodoSelect.length > 1 ){
              me.$vs.notify({
              text:'Existe más de un período configurado para activar Comuniquese con soporte',
              color:'warning',
              iconPack: 'feather',
              icon:'icon-check',
              time:5000,
              })
              return
            }
            me.popupActualizarPeriodo = true;
          }
        })
        .catch(function (error) {
          me.$vs.loading.close();
        })
      },
      changePeriodo() {
        let me = this;
        me.$vs.loading();
        let data = new FormData();
        data.append('idperiodoescolar', me.periodoSelect[0].idperiodoescolar);
        data.append('idinstitucion',    me.institucion.id)
        this.$http.post(this.$server_url + 'verifica_periodo', data)
          .then(res => {
            me.$vs.loading.close();
            if (res.data == 1) {
              me.$vs.notify({
                time: 8000,
                text: 'Este periodo ya se encuentra asignado a la institucion ' + me.institucion.label,
                color: 'danger',
                iconPack: 'feather',
                icon: 'icon-alert-triangle'
              })
            } else {
              me.$vs.notify({
                text: 'Periodo agregado correctamente a la institucion ' + me.institucion.label,
                color: 'success',
                iconPack: 'feather',
                icon: 'icon-check'
              })
            }
            me.getEscuelas()
            me.institucion            = {}
            me.popupActualizarPeriodo = false;
          })
          .catch(err => {
              console.log(err);
              me.$vs.loading.close();
          })
      },
      SeguimientoInstitucion(tr){
        let me = this;
        if(me.isAdmin == "yes"){
          me.$router.push('/administrador/seguimiento/institucion')
        }else{
          me.$router.push('/asesor/seguimiento/institucion')
        }
        localStorage.setItem('institucion_seguimiento_id',tr.id)
        localStorage.setItem('institucion_seguimiento_nombre',tr.label)
        localStorage.setItem('institucion_seguimiento_periodo_id',tr.id_periodo)
        localStorage.setItem('institucion_seguimiento_periodo',tr.periodo)
      },
    }
}
</script>