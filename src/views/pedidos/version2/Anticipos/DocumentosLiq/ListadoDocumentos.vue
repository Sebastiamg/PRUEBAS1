<template>
  <div>
    <vs-table stripe  pagination max-items="25" search :data="arrayContrato">
      <template slot="header">
          <div style="display:flex;">
              <vs-chip color="success" style="font-size:12px;">
                Cantidad: {{arrayContrato.length}}
              </vs-chip>
               <!-- <vs-button color="warning" type="line" icon="description"  size="small" class="mr-5 ml-3" style="font-size: 14px;" @click="activePrompt=true;">Exportar</vs-button> -->
               <!-- <vs-button type="line" icon="save" @click="$emit('changeChangeLiq',0)">Añadir Documento</vs-button> -->
          </div>
      </template>
      <template slot="thead">
          <vs-th>Documento</vs-th>
          <vs-th>Contrato</vs-th>
          <vs-th>Observación</vs-th>
          <!-- <vs-th>Acciones</vs-th> -->
      </template>
      <template slot-scope="{data}">
          <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
              <vs-td>
                  <p style="font-weight:bold;">Doc valor:</p>
                  <span>{{ data[indextr].doc_valor }}</span><br/>
                  <p style="font-weight:bold;">Doc. Número:</p>
                  <span>{{ data[indextr].doc_numero }}</span><br/>
                  <p style="font-weight:bold;">Doc. Nombre:</p>
                  <span>{{ data[indextr].doc_nombre }}</span><br/>
                  <p style="font-weight:bold;">Doc. Ci:</p>
                  <span>{{ data[indextr].doc_ci }}</span><br/>
                  <p style="font-weight:bold;">Doc. Institución:</p>
                  <span>{{ data[indextr].doc_institucion }}</span><br/>
                  <p style="font-weight:bold;">Doc. Tipo:</p>
                  <span>{{ data[indextr].doc_tipo }}</span><br/>
                  <b class="mt-1">Forma de pago:</b>
                  <p>{{ tr.tip_pag_nombre }}</p>
                  <p v-if="tr.tipo_Pago == 4">Pago Distribuidor</p>
                  <div v-if="tr.tipo_Pago == 4">
                    <b>Distribuidor:</b>
                    <p>{{ tr.distribuidor_usuario }}</p>
                  </div>
                  <p style="font-weight:bold;">Doc. Fecha:</p>
                  <span>{{ data[indextr].doc_fecha }}</span><br/>
                  <p v-if="!tr.archivo">
                  <b class="text-danger"> Solicitud de evidencias: No subida </b>
                  </p>
                  <p v-else class="imagen" @click="openDocument(tr)">
                      <b> Evidencia:
                          <!--PDF-->
                          <ion-icon v-if="tr.archivo.substr(-3) == 'pdf'" style="font-size:20px;color:green;position:relative;top:5px;" name="document-outline"></ion-icon>
                          <!--IMAGE-->
                          <ion-icon v-else style="font-size:20px;color:green;position:relative;top:5px;" name="camera-outline"></ion-icon>
                      </b>
                  </p>
              </vs-td>
              <vs-td>
                {{ tr.ven_codigo }}
              </vs-td>
              <vs-td height="30%" width="40%">
                <div class="overflow-y-auto h-24">
                  {{ tr.doc_observacion }}
                </div>
              </vs-td>
              <!-- <vs-td>
                <div class="flex"> -->
                  <!-- <vx-tooltip class="ml-3" style="display: inline-block;" text="Editar" position="top" color="success">
                      <vs-button size="small" class="modal-default-button" color="warning" @click="$emit('changeChangeLiq',1,tr)" type="line" icon-pack="feather" icon="icon-edit">
                      </vs-button>
                  </vx-tooltip> -->
                  <!-- <vx-tooltip class="ml-3" style="display: inline-block;" text="Eliminar" position="top" color="success">
                      <vs-button size="small" class="modal-default-button" color="danger" @click="openConfirm(data[indextr])" type="line" icon-pack="feather" icon="icon-trash">
                      </vs-button>
                  </vx-tooltip> -->
                <!-- </div>
              </vs-td> -->
          </vs-tr>
      </template>
  </vs-table>
  </div>
</template>
<script>

export default {
  data() {
    return{

    }
  },
  props:{
    arrayContrato:{
      type:Array,
      default:function(){
        return []
      }
    }
  },
  methods:{
    openDocument(tr){
      let me = this;
      let ruta = me.$data_url+'archivos/pedidos/pagos/'+tr.url
      window.open(ruta,'_blank')
    },
  }
}
</script>
