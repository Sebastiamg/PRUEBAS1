<template>
  <div>
    <div>
      <div class="flex justify-center mt-4">
        <vs-button class="p-3" v-if="pendientes == 0" icon="add" @click="$emit('changeCreate',true)">Crear solicitud de comision</vs-button>
      </div>
      <vs-table max-items="5" search pagination :data="arraySolicitudes">
        <template slot="header">
            <vs-chip  color="primary">Cantidad: <b> {{ arraySolicitudes.length }}</b></vs-chip>
        </template>
        <template slot="thead">
            <vs-th>Datos Solicitud</vs-th>
            <vs-th v-if="testado != 0">Datos Finalización</vs-th>
            <vs-th>Estado</vs-th>
            <vs-th  style="width:100px;">Acciones</vs-th>
        </template>
        <template slot-scope="{data}">
          <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
            <vs-td>
              # {{ tr.id_pedido }}
              <p><b>Solicitado:</b><span class="ml-1 text-primary font-bold">{{tr.cantidad_solicitada}} %</span></p>
              <b class="mt-3">Observación:</b>
              <p>{{ tr.observacion }}</p>
              <b>Fecha de solicitud:</b>
              <p>{{ tr.created_at }}</p>
              <div v-if="!userAsesor">
                <b>Institución:</b>
                <p>{{ tr.nombreInstitucion }}</p>
                <b>Asesor:</b>
                <p>{{ tr.asesor }}</p>
              </div>
            </vs-td>
            <vs-td v-if="testado != 0">
              <div v-if="tr.estado == 0">
                <p></p>
              </div>
              <div v-else>
                <b v-if="tr.estado == 1">Cantidad aprobada</b>
                <p v-if="tr.estado == 1">{{ tr.cantidad_finalizada }}</p>
                <b>Observación:</b>
                <p>{{ tr.observacion_finaliza }}</p>
                <b>Fecha de finalización</b>
                <p>{{ tr.fecha_finaliza }}</p>
                <b>{{tr.estado == 1 ? 'Aprobado' : 'Rechazado'}} por:</b>
                <p v-if="tr.id_grupo_finaliza == 25" class="text-success font-bold"><i class="fa-solid fa-shield"></i> {{tr.estado == 1 ? 'Aprobado' : 'Rechazado'}} por gerencia</p>
                <p v-else class="text-warning font-bold">{{tr.estado == 1 ? 'Aprobado' : 'Rechazado'}} por facturador</p>
                <p v-if="tr.asesor_edit">{{tr.asesor_edit}}</p>
              </div>
            </vs-td>
            <vs-td>
              <vs-chip v-if="tr.estado == 0" color="warning">Pendiente</vs-chip>
              <vs-chip v-if="tr.estado == 1" color="success">Aprobada</vs-chip>
              <vs-chip v-if="tr.estado == 2" color="#9D4CD2">Anulada</vs-chip>
              <vs-chip v-if="tr.estado == 3" color="danger">Rechazado</vs-chip>
            </vs-td>
            <vs-td>
              <!--button para editar-->
              <vs-button v-if="tr.estado == 0 && ( userAsesor || userRoot )" @click="$emit('changeEdit',tr)" class="my-4" color="primary" icon="edit" size="small">Editar</vs-button>
               <!--button para editar aprobado -->
               <vs-button v-if="tr.estado == 1 && ( userRoot || usuario.id_group == 23)" @click="$emit('changeEdit',tr)" class="my-4" color="primary" icon="edit" size="small">Editar</vs-button>
              <!--button para eliminar-->
              <vs-button v-if="tr.estado == 0 && usuario.id_group != 25" @click="$emit('changeDelete',tr)" color="danger" icon="delete" size="small">Eliminar</vs-button>
              <!--button para aprobar-->
              <vs-button v-if="!userAsesor && (tr.estado == 0)" class="my-5" @click="$emit('changeAprobar',tr,1,0)" color="success" icon="check" size="small">Aprobar</vs-button>
               <!--button para aprobar despues de ser aprobado-->
              <vs-button v-if="!userAsesor && (tr.estado == 1 && userRoot)" class="my-5" @click="$emit('changeAprobar',tr,1,1)" color="success" icon="check" size="small">Aprobar</vs-button>
              <!--button para rechazar-->
              <vs-button v-if="!userAsesor && tr.estado == 0 " class="my-5" @click="$emit('changeAprobar',tr,3,0)" color="warning" icon-pack="feather" icon="icon-x" size="small">Rechazar</vs-button>
            </vs-td>
          </vs-tr>
        </template>
      </vs-table>
    </div>
  </div>
</template>
<script>
 import {
    mapState
} from "vuex";
import moment from 'moment'
export default {
  components:{
  },
  data() {
    return{
      usuario:[],
      menu:0,
    }
  },
  computed:{
    ...mapState(["auth",'userRoot','susuario','ObjectPedido','userAsesor']),
  },
  props:{
    arraySolicitudes:{
      type:Array,
      default:function(){
        return []
      }
    },
    pendientes:{
      type:Number,
      default:0
    },
    desdegerencia:{
      type:Number,
      default:0
    },
    testado:{
      type:Number,
      default:0
    },
  },
  watch:{
    arraySolicitudes:{
      handler(newValue,oldValue){
        let me = this
        me.arraySolicitudes = newValue
        //FECHA create colocar formato YYYY-MM-DD HH:MM:SS
        me.arraySolicitudes.forEach(function(item){
          item.created_at = moment(item.created_at).format('YYYY-MM-DD HH:MM:SS')
          item.fecha_finaliza = moment(item.fecha_finaliza).format('YYYY-MM-DD HH:MM:SS')
        })
      },
      deep:true
    }
  },
  created(){
    let me = this
    me.usuario = JSON.parse(localStorage.getItem('usuario'))
  },
}
</script>
