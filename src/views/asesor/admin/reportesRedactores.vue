<template>
    <vx-card>


      <vs-table search :data="redactores">
        <template slot="header">
          Inicio: <flat-pickr class="m-1" style="width: 120px;" :config="configdateTimePicker" v-model="fecha_ini" placeholder="Fecha inicio" />  Fin:
          <flat-pickr class="m-1" style="width: 120px;" :config="configdateTimePicker" v-model="fecha_fin" placeholder="Fecha fin" />
          <vs-button class="m-1" radius color="dark" type="gradient" icon-pack="feather" icon="icon-search" @click="getReporte()"></vs-button>
        </template>

        <template slot="thead">
          <vs-th>#</vs-th>
          <vs-th sort-key="redactor">Redator</vs-th>
          <vs-th sort-key="cant_juegos">Juegos</vs-th>
          <vs-th sort-key="cant_preguntas">Preguntas</vs-th>
          <!-- <vs-th sort-key="cant_preguntas">Acción</vs-th> -->
        </template>

        <template slot-scope="{data}">
          <vs-tr :key="indextr" v-for="(tr, indextr) in data">
            <vs-td> {{ indextr+1 }} </vs-td>
            <vs-td :data="tr.redactor">
              {{ tr.redactor }}
              <br>
              <vs-button class="btn_estado m-1" v-if="tr.estado_idEstado == 1" size="small" color="success" type="gradient">Activo</vs-button>
              <vs-button class="btn_estado m-1" v-else size="small" color="danger" type="gradient">Inactivo</vs-button>
            </vs-td>
            <vs-td :data="tr.cant_juegos"> {{ tr.cant_juegos }} </vs-td>
            <vs-td :data="tr.cant_preguntas"> {{ tr.cant_preguntas }} </vs-td>
            <!-- <vs-td align="center">

            </vs-td> -->
          </vs-tr>
        </template>
      </vs-table>


    </vx-card>
</template>
<script>
import vSelect from 'vue-select'
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
export default {
    data() {
     return{
        usuario: [],
        redactores: [],
        fecha_ini: '',
        fecha_fin: '',
        configdateTimePicker: {
          enableTime: true,
          dateFormat: 'Y-m-d'
        }
     }
    },
    components: {
        flatPickr,
        'v-select': vSelect,
    },
    created(){
        let me = this;
        this.usuario = JSON.parse(localStorage.getItem('usuario'));
    },
    methods:{
        getReporte() {
            let me = this;
            if( me.fecha_ini == '' || me.fecha_fin == '' ){
              me.$vs.notify({ text: 'Ingrese la fecha de inicio y fin para realizar la búsqueda.', color: 'warning', iconPack: 'feather', icon: 'icon-alert-triangle' })
              return
            }
            me.$vs.loading();
            this.$http.get(this.$server_url+'reporte_redaccion/'+me.fecha_ini+'/'+me.fecha_fin)
            .then(function (res) {
                me.redactores = res.data
                me.$vs.loading.close()
            })
        },
    }
}
</script>
<style lang="scss">
@import "@/assets/scss/vuexy/apps/simple-calendar.scss";
</style>

<style>
.btn_estado{
  padding: 5px 15px 5px 15px !important;
}
</style>
