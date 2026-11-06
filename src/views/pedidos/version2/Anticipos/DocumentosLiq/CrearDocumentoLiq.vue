<template>
  <div>
    <div class="mt-3">
      <div class="vx-row">
        <div class="vx-col sm:w-1/2 w-full mb-2">
          <vs-input class="w-full" label="Doc. Valor"  v-model="document.doc_valor" />
        </div>
        <div class="vx-col sm:w-1/2 w-full mb-2">
          <vs-input class="w-full" label="Doc. Número"  v-model="document.doc_numero" />
        </div>
      </div>
      <div class="vx-row">
        <div class="vx-col sm:w-1/2 w-full mb-2">
          <vs-input class="w-full" label="Doc. Nombre"  v-model="document.doc_nombre" />
        </div>
        <div class="vx-col sm:w-1/2 w-full mb-2">
          <vs-input class="w-full" label="Doc. Ci" v-model="document.doc_ci" />
        </div>
      </div>
      <div class="vx-row">
        <div class="vx-col sm:w-1/2 w-full mb-2">
          <vs-input class="w-full" label="Doc. Cuenta"  v-model="document.doc_cuenta" />
        </div>
        <div class="vx-col sm:w-1/2 w-full mb-6">
          <vs-input type="email" class="w-full" label="Doc. Institución"  v-model="document.doc_institucion" />
        </div>
      </div>
      <div class="vx-row">
        <div class="vx-col sm:w-1/2 w-full mb-2">
          <vs-input class="w-full" label="Doc. Tipo"  v-model="document.doc_tipo" />
        </div>
        <div class="vx-col sm:w-1/2 w-full mb-6">
          <vs-input type="email" class="w-full" label="Doc. Observación"  v-model="document.doc_observacion" />
        </div>
      </div>
      <div class="vx-row">
        <div class="vx-col w-full">
          <vs-button class="mr-3 mb-2">Guardar</vs-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return{
      document:{
        doc_valor:0,
        doc_numero:'',
        doc_nombre:'',
        doc_ci:'',
        doc_cuenta:'',
        doc_institucion:'',
        doc_tipo:'',
        doc_observacion:'',
      },
    }
  },
  props:{
    id:{
      type:Number,
      default:0,
    },
    ObjectDocument:{
      type:Object,
      default:function(){
        return {}
      }
    }
  },
  mounted(){
    let me = this
    me.setValores()
  },
  methods:{
    setValores(){
      let me                = this
      //Edit
      if(me.id > 0){
        me.document         = me.ObjectDocument
      }else{
        me.document         = {
          doc_valor         : 0,
          doc_numero        : '',
          doc_nombre        : '',
          doc_ci            : '',
          doc_cuenta        : '',
          doc_institucion   : '',
          doc_tipo          : '',
          doc_observacion   : '',
        }
      }
    }
  }
}
</script>
