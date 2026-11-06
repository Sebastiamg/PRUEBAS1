<template>
  <div>
    <div>
      <div v-if="calcularPagoLiquidacion">
        <exportLiquidacionVue
        :VerificacionSelect="VerificacionSelect"
        :sumaTotalVALOR="sumaTotalVALOR"
        :sumaTotalValorRegalados="totalRegalados"
        :DetalleVerificacion="DetalleVerificacion"
        :totalCobroVenta="totalCobroVenta"
        :sendPedido="sendPedido"
        :cantidadVerificaciones="cantidadVerificaciones"
        :desdeConfiguracion="2"
        :sumaTotalRegalados =sumaTotalRegalados
        @changeHandleUpdatePayments="changeHandleUpdatePayments"
        />
      </div>
    </div>
  </div>
</template>
<script>
import exportLiquidacionVue from '../../../../exportLiquidacion.vue'
import Generalmix from '../../../../../../../mixins/Generalmix';
export default{
  mixins:[Generalmix],
  components:{
    exportLiquidacionVue,
  },
  data() {
    return{
      sumaTotalVALOR:0,
      DetalleVerificacion:[],
      //REGALADOS
      totalRegalados:0,
      totalCobroVenta:0,
      arregloRegalados:[],
      arrayCombos:[],
      //VENTA REAL
      arregloValoresVentaReal:[],
      arrayAllCodigos:[],
      arrayAllCodigosConCombos:[],
      //sumaVentaReal:0,
      calcularPagoLiquidacion:false,
      mixinIdInicioFormatoNewData:null,
      sumaTotalRegalados:0,
      CombosTotalDevolucionSueltosPorcentaje:0,
      id_periodoModuloDescuentoVenta:29,
      ifCondicionalDescuentoVenta:0,
    }
  },
  props:{
    VerificacionSelect:{
      type:Object,
      default:function(){
        return {}
      }
    },
    sendPedido:{
      type:Object,
      default:function(){
        return {}
      }
    },
    cantidadVerificaciones:{
      type:Number,
      default:0,
    },
  },
  mounted(){
    let me = this;
    // Verifica si los datos existen en localStorage
    const mixinData = localStorage.getItem('mixin_IdInicioFormatoNew');
    if (mixinData) {
    // Convierte el JSON en un array de objetos y extrae solo 'minimo' si existe
    const parsedData = JSON.parse(mixinData);
    me.mixinIdInicioFormatoNewData = parsedData.length > 0 ? parsedData[0].minimo : null;
    console.log("Valor de minimo:", me.mixinIdInicioFormatoNewData); // Verifica el valor en consola
    } else {
        console.warn("No se encontraron datos en localStorage para mixin_IdInicioFormatoNew");
    }
    me.limpiar()
    me.getAllCodigosXContrato()
  },
  methods:{
    getAllCodigosXContrato(){
      let me = this;
      const { id_institucion ,id_periodo }              = me.sendPedido
      const { id, num_verificacion, contrato }          = me.VerificacionSelect
      if(me.id_periodoModuloDescuentoVenta <= this.sendPedido.id_periodo){
        //me.ifCondicionalDescuentoVenta = 1
        me.ifCondicionalDescuentoVenta = 0
      }
      // me.sumaVentaReal =0
      me.arregloValoresVentaReal = []
      let rutaxperiodo = ''
      rutaxperiodo = this.$server_url + 'n_verificacion?contrato=' + contrato +
      '&getAllCodigosXContrato_new=yes&IdVerificacion=' + id +
      '&verificacion_id=' + num_verificacion +
      '&institucion_id=' + id_institucion +
      '&periodo_id=' + id_periodo +
      '&liquidados=1';

      me.$vs.loading();
      this.$http.get(rutaxperiodo)
      .then(function (res) {
        if(res.data.status == 0){
          me.m_message(res.data.message,'danger',5000)
          me.$vs.loading.close()
          return
        }

        me.arrayAllCodigos = res.data.filter(p =>
          (p.quitar_de_reporte != '1') &&
          ((p.combo == null || p.combo == '') || (p.codigo_combo == null || p.codigo_combo == '')) &&
          (p.tipo_codigo == '0')
        );
        me.arrayAllCodigosConCombos = res.data.filter(p =>
          (p.quitar_de_reporte != '1') &&
          (p.tipo_codigo == '0')
        );
        //se obtiene los combos
        me.arrayCombos = res.data.filter(p => p.tipo_codigo == '1')
        me.f_calcularCombosRegaladosDevolucionesSueltos()
        me.getVentaRealXVerificacion()
        me.getRegalados();
        me.getDetallesVerificacion()
        me.$vs.loading.close();
        if(res.data.status == 0){
          me.$vs.notify({
            text:res.data.message,
            color:'danger',
            iconPack: 'feather',
            icon:'icon-alert-triangle'})
        }
      })
      .catch(function (error) {
          console.log(error + ' error');
          me.$vs.loading.close()
          me.$vs.notify({
            text:"Hubo un error al intentar cargar los datos",
            color:'danger',
            iconPack: 'feather',
            icon:'icon-alert-triangle'})
          return
      })
    },
    f_calcularCombosRegaladosDevolucionesSueltos(){
      let me = this;
      me.CombosTotalDevolucionSueltosPorcentaje = 0
      me.arrayCombos.map((item) => {
        item.cantidad = item.cantidad_items
        item.nombre_original = item.nombre_libro
        item.subtotal        = (item.precio * item.cantidad).toFixed(2)*1;
        let idtipodoc = item.idtipodoc ? item.idtipodoc : 0;
        // solo a actas afectar el descuento
        if(idtipodoc == 2 || idtipodoc == 4){
          me.CombosTotalDevolucionSueltosPorcentaje += item.CombosTotalDevolucionSueltosPorcentaje
          const descuentoTexto = item.descuento ? item.descuento + "%" : "sin acta de %";
          item.nombre_libro = item.nombre_libro + " - " + descuentoTexto
          item.actaRegalado = 1
        }
        else{
          if(me.ifCondicionalDescuentoVenta == 1){
            //const descuentoTexto = item.descuento ? item.descuento + "%" : "sin descuento %";
            const descuentoTexto = me.sendPedido.descuento + "%";
            item.nombre_libro    = item.nombre_libro + " | " + descuentoTexto;
          }
        }
      });
    },
    getVentaRealXVerificacion(){
      let me = this;
      const { id_institucion ,id_periodo }              = me.sendPedido
      const { id, num_verificacion, contrato }          = me.VerificacionSelect
      //si no hay codigos no hace nada
      if(me.arrayAllCodigos.length == 0){  return }
      // me.sumaVentaReal            = 0
      me.arregloValoresVentaReal  = []
      let datos                   = me.arrayAllCodigos.filter(p => p.estado_liquidacion == '0' && p.bc_institucion == id_institucion && p.estado != '2' && p.contrato == contrato)
      // Itera a través de los elementos del array
      datos.forEach(item => {
        const nombre_libro    = item.nombre_libro;
        const codigo          = item.codigo;
        const precio          = item.precio;
        const libro_id        = item.libro_id;
        const IdVerificacion  = item.IdVerificacion;
        const verificacion_id = item.verificacion_id;
        const libro_idlibro   = item.libro_idlibro;
        // Busca si ya existe un objeto con el mismo libro en groupedData
        const existingGroup = me.arregloValoresVentaReal.find(group => group.nombre_libro === nombre_libro);
        // Si no existe, crea un nuevo objeto y agrégalo a groupedData
        if (!existingGroup) {
          me.arregloValoresVentaReal.push({ nombre_libro, codigo, precio, libro_id, IdVerificacion, verificacion_id, libro_idlibro, cantidad: 1 });
        } else {
          // Si existe, incrementa la cantidad en el objeto existente
          existingGroup.cantidad++;
        }
      });

    },
    getRegalados(){
      let me = this
      me.totalRegalados = 0
      me.totalCobroVenta = 0
      me.arregloRegalados = []
      const { id_institucion ,id_periodo, descuento }                      = me.sendPedido
      const { id, num_verificacion,tipoPago,permiso_cobro_venta_directa }  = me.VerificacionSelect
        //AGRUPADO
        let datos                   = me.arrayAllCodigosConCombos.filter(p => (p.estado_liquidacion == '2') && (p.bc_institucion == id_institucion || p.venta_lista_institucion == id_institucion) )
      datos.forEach(item => {
        const nombre_libro    = item.nombre_libro;
        const codigo          = item.codigo;
        const precio          = item.precio;
        const libro_id        = item.libro_id;
        const IdVerificacion  = item.IdVerificacion;
        const verificacion_id = item.verificacion_id;
        const libro_idlibro   = item.libro_idlibro;
        // Busca si ya existe un objeto con el mismo libro en groupedData
        const existingGroup = me.arregloRegalados.find(group => group.nombre_libro === nombre_libro);
        // Si no existe, crea un nuevo objeto y agrégalo a groupedData
        if (!existingGroup) {
          me.arregloRegalados.push({ nombre_libro, codigo, precio, libro_id, IdVerificacion,verificacion_id, libro_idlibro, cantidad: 1  });
        } else {
          // Si existe, incrementa la cantidad en el objeto existente
          existingGroup.cantidad++;
        }
      });
      // calcular el total de regalados modulo anterior
      if(me.sendPedido.regaladosReporteNuevo  == 0){
        me.arregloRegalados.map((item) => {
          item.valor        = item.precio * item.cantidad
          me.totalRegalados += item.valor
        });
        if(me.arregloRegalados.length > 0){
          let prevalor        = 0
          //COBRO VENTA DIRECTA=>0 = NADA; 1 = 100%; 2 =porcentaje de la escuela;
          //tipoPago => 0 =  NADA; 1 = Cancelar Total; 2 = Descontar; 3 = Regalado = 4 personalizado
          if(tipoPago == 1 || tipoPago == 3) { me.totalCobroVenta = 0 }
          if(tipoPago == 2 || me.setPersonalizado == 1) {
            prevalor = descuento
            //si el cobro de venta directa esta activado
            if(permiso_cobro_venta_directa == 1){
              me.totalCobroVenta  = ( me.totalRegalados - ( me.totalRegalados * prevalor ) / 100)
            }else{
              me.totalCobroVenta = 0
            }
          }
        }
      }
    },
     //aqui traigo codigos normales y codigos regalados
    getDetallesVerificacion(){
      let me = this;
      me.sumaTotalVALOR             = 0
      me.sumaTotalRegalados         = 0
      me.DetalleVerificacion        = []
      let datos                     = []
      const { id_institucion ,id_periodo }              = me.sendPedido
      const { id, num_verificacion, contrato }          = me.VerificacionSelect
      //AGRUPADO
      // despues de sierra 2024 para obtener agrupar por actas los codigos regalados
      if(me.sendPedido.regaladosReporteNuevo == 1){
        datos                   = me.arrayAllCodigos.filter(p => (p.estado_liquidacion == '0') && (p.bc_institucion == id_institucion || p.venta_lista_institucion == id_institucion) )
      }else{
        datos                   = me.arrayAllCodigos.filter(p => (p.estado_liquidacion == '0' || p.estado_liquidacion == '2') && (p.bc_institucion == id_institucion || p.venta_lista_institucion == id_institucion) )
      }
      datos.forEach(item => {
        // const descuentoTexto = item.descuento ? item.descuento + "%" : "sin descuento %";
        var preDescuento     = item.descuento
        if(me.ifCondicionalDescuentoVenta == 1){
          preDescuento       = me.sendPedido.descuento
        }
        const descuentoTexto = preDescuento ? preDescuento + "%" : "sin descuento %";

        if(me.ifCondicionalDescuentoVenta == 1){
          var nombre_libro    = item.nombre_libro + " | " + descuentoTexto;
        }else{
          var nombre_libro    = item.nombre_libro;
        }
        const nombre_original = item.nombre_libro;
        const subtotal        = (item.precio * item.cantidad).toFixed(2)*1;
        // const descuento    = item.descuento;
        const descuento       = preDescuento;
        const codigo          = item.codigo;
        const precio          = item.precio;
        const libro_id        = item.libro_id;
        const IdVerificacion  = item.IdVerificacion;
        const verificacion_id = item.verificacion_id;
        const libro_idlibro   = item.libro_idlibro;
        // Busca si ya existe un objeto con el mismo libro en groupedData
        const existingGroup = me.DetalleVerificacion.find(group => group.nombre_libro === nombre_libro);
        // Si no existe, crea un nuevo objeto y agrégalo a groupedData
        if (!existingGroup) {
          me.DetalleVerificacion.push({ nombre_libro, codigo, precio, libro_id, IdVerificacion,verificacion_id, libro_idlibro ,cantidad: 1, descuento, nombre_original, subtotal });
        } else {
          // Si existe, incrementa la cantidad en el objeto existente
          existingGroup.cantidad++;
        }
      });

       me.DetalleVerificacion.map((item) => {
        item.valor        = item.precio * item.cantidad
        if(me.ifCondicionalDescuentoVenta == 1){
          // Si descuento es null, NaN, 0 o no válido, marcar valor como 0 para revisión
          if (!item.descuento) {
            item.valor = item.valor;
          } else {
            let descuentoValor = (item.valor * item.descuento) / 100;
            item.valor = item.valor - descuentoValor;
            item.subtotal = (item.cantidad * item.precio).toFixed(2)*1;
          }
        }

      });

      //OBSEQUIOS SI PERMISO_ACTA_OBSEQUIOS = 1
      let arrayRegaladosNuevo = []
      // despues de sierra 2024 para obtener agrupar por actas los codigos regalados
      if(me.sendPedido.regaladosReporteNuevo == 1){
        let preRegalados                   = me.arrayAllCodigos.filter(p => (p.estado_liquidacion == '2') )
        preRegalados.forEach(item => {
          const descuentoTexto = item.descuento ? item.descuento + "%" : "sin acta de %";
          const sufijo_HD = item.ifObsequio === 0 ? " (HD)" : "";
          const nombre_libro   = item.nombre_libro + " - " + descuentoTexto + sufijo_HD;
          const nombre_original = item.nombre_libro + sufijo_HD;
          const codigo         = item.codigo;
          const precio         = item.precio;
          const descuento      = item.descuento;
          // Busca si ya existe un objeto con el mismo libro en groupedData
          const existingGroup = arrayRegaladosNuevo.find(group => group.nombre_libro === nombre_libro);

          // Si no existe, crea un nuevo objeto y agrégalo a groupedData
          if (!existingGroup) {
            arrayRegaladosNuevo.push({ nombre_libro, codigo, cantidad: 1, precio, descuento, nombre_original });
          } else {
            // Si existe, incrementa la cantidad en el objeto existente
            existingGroup.cantidad++;
          }
        });

        //sumar arrayRegaladosNuevo
        arrayRegaladosNuevo.map((item) => {
          let precio    = parseFloat(item.precio) || 0;
          let cantidad  = parseFloat(item.cantidad) || 0;
          let descuento = parseFloat(item.descuento);
          item.subtotal = (precio * cantidad).toFixed(2)*1;
          let preValor = precio * cantidad;

          // Si descuento es null, NaN, 0 o no válido, marcar valor como 0 para revisión
          if (!descuento) {
            item.valor = 0;
          } else {
            let descuentoValor = (preValor * descuento) / 100;
            item.valor = preValor - descuentoValor;
          }
          item.actaRegalado = 1
        });
      }


      //unir arrayCombos y arrayRegaladosNuevo  a DetalleVerificacion
      me.DetalleVerificacion = [...me.DetalleVerificacion,...arrayRegaladosNuevo,...me.arrayCombos]
    //sumar combos
      me.arrayCombos.forEach(function (item) {
        var idtipodoc = item.idtipodoc || 0;
        var valorBase = item.precio * item.cantidad_items;
        var descuento = item.descuento || 0;

        if (idtipodoc != 2 && idtipodoc != 4) {
          // para que los combos se descuente el descuento individual
          if(me.ifCondicionalDescuentoVenta == 1){
            item.valor = valorBase * (1 - (descuento / 100));
          }else{
            item.valor = valorBase;
          }
        } else {
          item.valor = valorBase * (1 - (descuento / 100));
          console.log("item.codigo:", item.codigo, "valorBase:", valorBase, "descuento:", descuento, "item.valor:", item.valor);
        }
      });

      let regaladosNormales = 0
      // sumar sumaTotalRegalados de arrayRegaladosNuevo
      arrayRegaladosNuevo.forEach(function (item) {
        me.sumaTotalRegalados += item.valor;
        regaladosNormales += item.valor;
      });
      console.log("regaladosNormales",regaladosNormales)
      // sumar sumaTotalRegalados de combos
      me.sumaTotalRegalados += me.CombosTotalDevolucionSueltosPorcentaje
      console.log("regalados combos",me.CombosTotalDevolucionSueltosPorcentaje)
      // dejar valor cero los que tengan actaRegalado = 1 validar que exista la propiedad actaRegalado
      me.DetalleVerificacion.forEach(function (item) {
        if (item.actaRegalado && item.actaRegalado == 1) {
          item.valor = 0;
        }
      });
      // sumar total valor
      me.DetalleVerificacion.forEach(function (item) {
        me.sumaTotalVALOR += item.valor;
      });
      console.log("sumaTotalVALOR",me.sumaTotalVALOR)
      // console.log("totalRegalados",me.totalRegalados)
      console.log("sumaTotalRegalados",me.sumaTotalRegalados)
      // usar next tick el updateValorLiquidacion hasta que se sumen los valores
      me.$nextTick(() => {
        me.updateValorLiquidacion();
      });
      // me.updateValorLiquidacion()
    },
    updateValorLiquidacion(){
      let me = this;
      let formData = new FormData();
      formData.append('verificacion_id',    me.VerificacionSelect.id);
      if(me.sendPedido.regaladosReporteNuevo == 1){
        formData.append('venta_real',         me.sumaTotalVALOR);
        formData.append('venta_real_regalados',me.totalRegalados)
      }else{
        formData.append('venta_real',         me.sumaTotalVALOR - me.totalRegalados);
        formData.append('venta_real_regalados',me.totalRegalados)
      }
      this.$http.post(this.$server_url+'updateVentaReal', formData)
      .then(res => {
        //Calcular los valores
        console.log("respuesta updateValorLiquidacion",res.data)
        me.calcularPagoLiquidacion = true
      })
    },
    changeHandleUpdatePayments(e){
      let me = this
      me.changeHandleUpdatePayments       = false
      me.limpiar()
      me.$emit('changeHandleUpdatePayments',true)
    },
    limpiar(){
      let me = this
      me.sumaTotalVALOR           = 0
      me.DetalleVerificacion      = []
      //REGALADOS
      me.totalRegalados           = 0
      me.totalCobroVenta          = 0
      me.arregloRegalados         = []
      //VENTA REAL
      me.arregloValoresVentaReal  = []
      // me.sumaVentaReal            = 0
      me.calcularPagoLiquidacion  = false
      //CONVENIO
      me.arregloHijosConvenio     = []
      me.NumeroConvenio           = 0
      me.ObjectConvenio           = {}
      me.SaldoConvenio            = 0
      me.totalAnticipos           = 0
    },
  }
}
</script>
