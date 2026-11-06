<template>
  <div>
    <!-- resumen convenio -->
    <div class="vx-row mb-4">
      <div class="vx-col w-full sm:w-1/3">
        <vs-card>
          <p class="text-sm text-gray-500">Anticipo Global</p>
          <p class="text-2xl font-bold text-primary">$ {{ convenio.anticipo_global || 0 }}</p>
        </vs-card>
      </div>
      <div class="vx-col w-full sm:w-1/3">
        <vs-card>
          <p class="text-sm text-gray-500">Total Pagado</p>
          <p class="text-2xl font-bold text-success">$ {{ total_pagado }}</p>
        </vs-card>
      </div>
      <div class="vx-col w-full sm:w-1/3">
        <vs-card>
          <p class="text-sm text-gray-500">Deuda Restante</p>
          <p class="text-2xl font-bold text-danger">$ {{ deuda }}</p>
        </vs-card>
      </div>
    </div>

    <div class="mt-3">
      <vs-button icon="add" class="mb-3" @click="f_limpiar(); title='Registrar Pago'; popupAdd=true;">
        Registrar Pago
      </vs-button>
    </div>

    <vs-table max-items="10" search pagination :data="arrayPagos">
      <template slot="header">
        <vs-chip color="primary">Pagos: <b>{{ arrayPagos.length }}</b></vs-chip>
      </template>
      <template slot="thead">
        <vs-th>Valor</vs-th>
        <vs-th>Descripción</vs-th>
        <vs-th>Creado por</vs-th>
        <vs-th>Fecha</vs-th>
        <vs-th>Acciones</vs-th>
      </template>
      <template slot-scope="{data}">
        <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
          <vs-td>
            <b class="text-primary">$ {{ tr.valor }}</b>
          </vs-td>
          <vs-td>{{ tr.descripcion }}</vs-td>
          <vs-td>
            <p>{{ tr.usuario_creador }}</p>
            <small v-if="tr.usuario_editor" class="text-gray-400">Editado: {{ tr.usuario_editor }}</small>
          </vs-td>
          <vs-td>{{ tr.created_at }}</vs-td>
          <vs-td align="center">
            <vs-button size="small" class="m-1" icon-pack="feather" icon="icon-edit"
              @click="pagoSelected=tr; f_preEditar();">Editar</vs-button>
            <vs-button size="small" class="m-1" color="danger" icon-pack="feather" icon="icon-trash-2"
              @click="pagoSelected=tr; popupConfirmDelete=true;">Eliminar</vs-button>
          </vs-td>
        </vs-tr>
      </template>
    </vs-table>

    <!-- modal crear/editar -->
    <vs-popup :title="title" :active.sync="popupAdd" class="informacionformhijo">
      <div v-if="popupAdd">
        <div class="vx-row">
          <div class="vx-col w-full">
            <small>Valor:</small>
            <vs-input v-model="datos.valor" class="w-full" type="number" min="0"
              @input="datos.valor = limpiarValorNumerico(datos.valor)" />
          </div>
          <div class="vx-col w-full mt-4">
            <small>Descripción:</small>
            <vs-textarea counter="500" :counter-danger.sync="counterDanger"
              height="150px" label="Descripción" v-model="datos.descripcion" />
          </div>
        </div>
        <div class="flex justify-center mt-4">
          <vs-button @click="f_guardar()" class="m-2" icon="check">Guardar</vs-button>
          <vs-button @click="popupAdd=false" type="border" color="warning" class="m-2" icon="close">Cancelar</vs-button>
        </div>
      </div>
    </vs-popup>

    <!-- modal confirmar eliminar -->
    <vs-popup title="Eliminar Pago" :active.sync="popupConfirmDelete" class="informacionformhijo">
      <div v-if="popupConfirmDelete">
        <p class="text-center font-bold text-xl">¿Estás seguro de eliminar este pago?</p>
        <div class="flex justify-center mt-5">
          <vs-button @click="f_eliminar()" class="m-2" color="danger" icon="check">Sí, eliminar</vs-button>
          <vs-button @click="popupConfirmDelete=false" type="border" color="warning" class="m-2" icon="close">Cancelar</vs-button>
        </div>
      </div>
    </vs-popup>
  </div>
</template>
<script>
import Generalmix from '../../../../../mixins/Generalmix'

export default {
  mixins: [Generalmix],
  props: {
    pedidos_convenios_id: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      usuario: [],
      arrayPagos: [],
      convenio: {},
      total_pagado: 0,
      popupAdd: false,
      popupConfirmDelete: false,
      title: 'Registrar Pago',
      counterDanger: false,
      id: 0,
      datos: {
        valor: 0,
        descripcion: '',
      },
      pagoSelected: null,
    }
  },
  computed: {
    deuda() {
      let anticipo = Number(this.convenio.anticipo_global || 0)
      return (anticipo - Number(this.total_pagado)).toFixed(2)
    }
  },
  mounted() {
    this.usuario = JSON.parse(localStorage.getItem('usuario'))
    if (this.pedidos_convenios_id > 0) {
      this.f_getPagos()
    }
  },
  watch: {
    pedidos_convenios_id(val) {
      if (val > 0) this.f_getPagos()
    }
  },
  methods: {
    f_getPagos() {
      let me = this
      me.arrayPagos = []
      me.$http.get(me.$server_url + `convenio?getPagosConvenio=1&id_convenio=${me.pedidos_convenios_id}`)
        .then(res => {
          if (res.data.status == 0) {
            me.m_message(res.data.message, 'warning')
            return
          }
          me.arrayPagos   = res.data.pagos
          me.total_pagado = res.data.total_pagado
          // tomar datos del convenio del primer registro si existe
          if (me.arrayPagos.length > 0) {
            me.convenio = {
              anticipo_global: me.arrayPagos[0].anticipo_global,
              convenio_anios:  me.arrayPagos[0].convenio_anios,
            }
          }
        })
        .catch(err => console.log(err))
    },
    f_preEditar() {
      let me = this
      me.id                = me.pagoSelected.id
      me.datos.valor       = me.pagoSelected.valor
      me.datos.descripcion = me.pagoSelected.descripcion
      me.title             = 'Editar Pago'
      me.popupAdd          = true
    },
    f_guardar() {
      let me = this
      if (!me.datos.valor || Number(me.datos.valor) <= 0) {
        me.m_message('El valor debe ser mayor a 0', 'warning')
        return
      }
      me.datos.descripcion = me.datos.descripcion.trim()
      if (!me.datos.descripcion) {
        me.m_message('La descripción es requerida', 'warning')
        return
      }
      if (me.datos.descripcion.length > 500) {
        me.m_message('La descripción no puede superar 500 caracteres', 'warning')
        return
      }
      let formData = new FormData()
      formData.append('savePagoConvenio', 1)
      formData.append('id',           me.id)
      formData.append('id_convenio',  me.pedidos_convenios_id)
      formData.append('valor',        me.datos.valor)
      formData.append('descripcion',  me.datos.descripcion)
      formData.append('id_usuario',   me.usuario.idusuario)
      me.$http.post(me.$server_url + `convenio`, formData)
        .then(res => {
          if (res.data.status == 0) {
            me.m_message(res.data.message, 'warning')
            return
          }
          me.popupAdd = false
          me.f_limpiar()
          me.f_getPagos()
          me.m_message(res.data.message, 'success')
        })
        .catch(err => {
          me.popupAdd = false
          me.m_message('Error al guardar el pago', 'warning')
          console.log(err)
        })
    },
    f_eliminar() {
      let me = this
      let formData = new FormData()
      formData.append('eliminarPagoConvenio', 1)
      formData.append('id',         me.pagoSelected.id)
      formData.append('id_usuario', me.usuario.idusuario)
      me.$http.post(me.$server_url + `convenio`, formData)
        .then(res => {
          if (res.data.status == 0) {
            me.m_message(res.data.message, 'warning')
            return
          }
          me.popupConfirmDelete = false
          me.f_getPagos()
          me.m_message(res.data.message, 'success')
        })
        .catch(err => {
          me.popupConfirmDelete = false
          me.m_message('Error al eliminar el pago', 'warning')
          console.log(err)
        })
    },
    f_limpiar() {
      this.id = 0
      this.datos.valor = 0
      this.datos.descripcion = ''
      this.title = 'Registrar Pago'
    }
  }
}
</script>
<style scoped>
.informacionformhijo {
  z-index: 51002;
}
</style>
