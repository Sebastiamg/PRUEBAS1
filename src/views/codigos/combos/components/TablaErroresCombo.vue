<template>
  <div>
      <vs-table :max-items="items" stripe search pagination :data="arregloProblemasPaquete" v-if="arregloProblemasPaquete.length > 0">
          <template slot="header">
              <vs-chip  color="primary">Cantidad: <b> {{ arregloProblemasPaquete.length }}</b></vs-chip>
          </template>
          <template slot="thead">
              <vs-th>Código de {{ tipoImortacion }}</vs-th>
              <vs-th>Problema</vs-th>
              <vs-th>Códigos</vs-th>
          </template>
          <template slot-scope="{data}">
              <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                  <vs-td>
                      {{data[indextr].codigoPaquete}}<br>
                  </vs-td>
                  <vs-td>
                      {{data[indextr].problema}}<br>
                      <div v-if="tr.problema == 'Hay problemas con los'+tipoImortacion +' corrija por favor'">
                          <div v-if="tr.setpaquetes.length > 0">
                            <h5>{{ tipoImortacion }}s encontrados: {{ tr.setpaquetes.length }}</h5>
                            <ul>
                              <li v-for="(item,key) in tr.setpaquetes" :key="key">
                                {{ tipoImortacion }}: {{ item.codigo  }}
                              </li>
                            </ul>
                          </div>
                      </div>
                  </vs-td>
                  <vs-td>
                    <div v-if="tr.codigosHijos.length == 0">
                      <span v-if="onlyCodes == '0'">No hay problemas con los códigos del {{ tipoImortacion }}</span>
                    </div>
                    <div v-else>
                      <vs-collapse accordion >
                        <vs-collapse-item>
                          <div slot="header">
                            Mostrar códigos con errores <ion-icon style="font-size:25px;position: relative;top:8px;" name="arrow-down-circle-outline"></ion-icon>
                          </div>
                          <TableProblemasDiagnosticoVue :items="5" :onlyCodes="onlyCodes" :arregloProblemasDiagnostico="tr.codigosHijos"/>
                        </vs-collapse-item>
                       </vs-collapse>
                    </div>
                </vs-td>
              </vs-tr>
          </template>
      </vs-table>
  </div>
</template>
<script>
import TableProblemasDiagnosticoVue from '../../components/utils/TableProblemasDiagnostico.vue';
export default{
  data(){
      return{

      }
  },
  components:{
    TableProblemasDiagnosticoVue,
  },
  props:{
      items:{
          type:Number,
          default:0
      },
      arregloProblemasPaquete:{
          type:Array,
          default:[]
      },
      onlyCodes:{
        type:Number,
        default:0
      },
      tipoImortacion:{
        type:String,
        default:'paquete'
      }
  }
}
</script>
