<template>
    <div class="mt-5">

        <!-- CARDS DE TOTALES -->
        <div class="flex flex-wrap gap-4 mt-6 mb-6">
          <div class="stat-card">
            <div class="stat-icon" style="background: #7367f0;">
              <i class="fa-solid fa-shopping-bag"></i>
            </div>
            <div class="stat-content">
              <p class="stat-label">Total Pedido</p>
              <h3 class="stat-value">{{ totalPedido }}</h3>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon" style="background: #ff9f43;">
              <i class="fa-solid fa-rotate-left"></i>
            </div>
            <div class="stat-content">
              <p class="stat-label">Total Cantidad Devuelta</p>
              <h3 class="stat-value">{{ totalCantidadDevuelta }}</h3>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon" style="background: #28c76f;">
              <i class="fa-solid fa-boxes-stacked"></i>
            </div>
            <div class="stat-content">
              <p class="stat-label">Total Stock en Asesor</p>
              <h3 class="stat-value">{{ totalStockAsesor }}</h3>
            </div>
          </div>
        </div>

        <!-- HEADER CON CONTADOR Y EXPORTAR -->
        <div class="flex flex-wrap items-center gap-3 mb-4">
          <vs-chip color="primary">Cantidad: <b> {{ arregloStock.length }}</b></vs-chip>
          <vs-button @click="exportarExcel" color="success" type="filled" icon="file_download">Exportar Excel</vs-button>
          <div class="cantidad-seleccionada">
            <i class="fa-solid fa-check-circle"></i>
            <span>Cantidad Seleccionada: <b>{{ sumaSeleccionado }}</b></span>
          </div>
          <vs-checkbox v-model="mostrarSoloConValor">Mostrar solo con valor</vs-checkbox>
        </div>

        <vs-table max-items="10" search pagination :data="arregloStockFiltrado">
            <template slot="thead">
                <vs-th>Código</vs-th>
                <vs-th>Libro</vs-th>
                <vs-th>Cantidad Pedida</vs-th>
                <vs-th>Cantidad Devuelta</vs-th>
                <vs-th>stock en el asesor</vs-th>
                <vs-th>Solicitar</vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td>
                        {{data[indextr].pro_codigo}}<br>
                    </vs-td>
                    <vs-td>
                       {{data[indextr].nombrelibro}}<br>
                    </vs-td>
                    <vs-td>
                        {{data[indextr].cantidadPedidaActual}}<br>
                    </vs-td>
                    <vs-td>
                        {{data[indextr].cantidad_devuelta_total}}<br>
                    </vs-td>
                    <vs-td>
                        {{ tr.stockAsesor }}
                    </vs-td>
                    <vs-td>
                        <vs-input type="number" min="1" v-if="tr.stockAsesor > 0" :max="tr.stockAsesor" @input="statusButton(tr)" @blur="revisarCantidad(tr)" label-placeholder="Ingrese la cantidad a enviar" v-model="tr.formato"/>
                        <p v-else class="text-danger">No existe stock</p>
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>
        <div class="flex justify-center">
            <vs-button @click="openConfirm()" color="success" icon="save" type="relief">Guardar</vs-button>
            <!--cancelar-->
            <vs-button class="ml-5" @click="$emit('change',false)" color="danger" icon="close" type="relief">Cancelar</vs-button>
        </div>
        <br><br><br><br><br><br><br><br><br><br>
    </div>
</template>
<script>
export default{
    data() {
        return {
            usuario:[],
            arregloStock:[],
            mostrarSoloConValor: false,
        };
    },
    props:{
        periodo_id:{
            type:Number,
            default:0
        },
        id:{
            type:Number,
            default:0,
        }
    },
    computed:{
      sumaSeleccionado(){
        let me = this;
        if(me.arregloStock.length >0){
            let datos = me.arregloStock.filter(p => p.formato)
            let total = datos.reduce((a, b) => a + parseInt((b["formato"] || 0)), 0);
            return total
        }
      },
      arregloStockFiltrado(){
        let me = this;
        if(me.mostrarSoloConValor){
            return me.arregloStock.filter(item => item.formato > 0);
        }
        return me.arregloStock;
      },
      totalPedido(){
        let me = this;
        if(me.arregloStock.length > 0){
            return me.arregloStock.reduce((a, b) => a + parseInt((b.cantidadPedidaActual || 0)), 0);
        }
        return 0;
      },
      totalCantidadDevuelta(){
        let me = this;
        if(me.arregloStock.length > 0){
            return me.arregloStock.reduce((a, b) => a + parseInt((b.cantidad_devuelta_total || 0)), 0);
        }
        return 0;
      },
      totalStockAsesor(){
        let me = this;
        if(me.arregloStock.length > 0){
            return me.arregloStock.reduce((a, b) => a + parseInt((b.stockAsesor || 0)), 0);
        }
        return 0;
      },
    },
    created(){
        let me = this;
        me.usuario = JSON.parse(localStorage.getItem("usuario"));
    },
    mounted(){
        let me = this;
        me.getStock()
    },
    methods:{
        getStock() {
            let me = this;
            me.arregloStock = []
            me.$vs.loading();
            this.$http.get(this.$server_url+'getStockProlipaDevolucion?asesor_id='+me.usuario.idusuario+'&periodo_id='+me.periodo_id)
                .then(function (res) {
                  me.$vs.loading.close()
                  if(res.data.status == 0){
                    me.$vs.notify({
                      text:res.data.message,
                      color:'danger',
                      iconPack: 'feather',
                      icon:'icon-alert-circle'
                    })
                    return
                  }
                    me.arregloStock = res.data
                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()
                })
        },
        statusButton(tr){
            let me = this;
            if(tr.formato < 0){
                //si es vacio dejar en cero el formato
                tr.formato = 0
            }
            if(tr.formato > tr.stockAsesor){
                tr.formato = tr.stockAsesor
            }

        },
        revisarCantidad(tr){
            let me = this;
            tr.formato = parseInt(tr.formato) || 0;
            if(tr.formato == ""){
                //si es vacio dejar en cero el formato
                tr.formato = 0
            }
            //si es mayor al stockAsesor dejo el formato en valor stockAsesor
            if(tr.formato > tr.stockAsesor){
                tr.formato = tr.stockAsesor
            }
        },
        openConfirm(){
            let me = this
            //debe aver al menos un formato > 0
            if(me.sumaSeleccionado == 0){
                me.$vs.notify({
                    text:'Debe ingresar al menos una cantidad',
                    color:'danger',
                    iconPack: 'feather',
                    icon:'icon-check'})
                return
            }
            this.$vs.dialog({
                type:'confirm',
                color: 'danger',
                acceptText:'aceptar',
                cancelText:'cancelar',
                title: `Confirmar`,
                text: 'Estas seguro de devolver estas guias a bodega',
                accept:this.guardarStock
            })
        },
        guardarStock(){
            let me = this;
            //setear valores nulos
            var setValores = []
            setValores = me.arregloStock.filter(p =>  p.formato > 0)
            if(setValores.length == 0){
                me.$vs.notify({
                    text:'Debe ingresar al menos una cantidad',
                    color:'danger',
                    iconPack: 'feather',
                    icon:'icon-check'})
                return
            }
            let formData = new FormData();
            formData.append('id',               me.id)
            formData.append('periodo_id',       me.periodo_id);
            formData.append('asesor_id',        me.usuario.idusuario);
            formData.append('data_detalle',     JSON.stringify(setValores))
            //tipo 1 = resta; 0 = suma
            formData.append('tipo',             0)
            me.$vs.loading()
            this.$http.post(this.$server_url+'saveDevolucionGuiasBodega', formData)
            .then(res => {
                me.$vs.loading.close()
                if(res.data.status == 0){
                    me.$vs.notify({
                        text:res.data.message,
                        color:'success',
                        iconPack: 'feather',
                        icon:'icon-check'
                    })
                }else{
                    me.$vs.notify({
                        text:res.data.message,
                        color:'primary',
                        iconPack: 'feather',
                        icon:'icon-check'
                    })
                }
                me.getStock()
                me.$emit('change',true)
            })
            .catch((e) => {
                me.$vs.loading.close()
            })
        },
        exportarExcel(){
            let me = this;
            if(me.arregloStock.length == 0){
                me.$vs.notify({
                    text:'No hay datos para exportar',
                    color:'warning',
                    iconPack: 'feather',
                    icon:'icon-alert-circle'
                })
                return
            }

            import('@/vendor/Export2Excel').then(excel => {
                const tHeader = ['Código', 'Libro', 'Cantidad Pedida', 'Cantidad Devuelta', 'Stock en Asesor']
                const filterVal = ['pro_codigo', 'nombrelibro', 'cantidadPedidaActual', 'cantidad_devuelta_total', 'stockAsesor']
                const list = me.arregloStock
                const data = me.formatJson(filterVal, list)
                excel.export_json_to_excel({
                    header: tHeader,
                    data,
                    filename: 'Devolución_Guías_Bodega_' + new Date().getTime(),
                    autoWidth: true,
                    bookType: 'xlsx'
                })
            })
        },
        formatJson(filterVal, jsonData) {
            return jsonData.map(v => filterVal.map(j => {
                if (j === 'nombrelibro') {
                    return 'GUIA ' + v[j]
                }
                return v[j]
            }))
        },

    }
}
</script>
<style scoped>
.boton1 {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  width: 250px;
  padding: 12px;
  display: flex;
  background: #509AF8;
  border-radius: 8px;
  box-shadow: 0px 0px 5px -3px #111;
}

.info__icon {
  width: 20px;
  height: 20px;
  transform: translateY(-2px);
  margin-right: 8px;
}

.info__icon path {
  fill: #fff;
}

.info__title {
  font-weight: 500;
  font-size: 14px;
  color: #fff;
}

.info__close {
  width: 20px;
  height: 20px;
  cursor: pointer;
  margin-left: auto;
}

.info__close path {
  fill: #fff;
}

.stat-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  min-width: 250px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
  font-size: 24px;
}

.stat-content {
  flex: 1;
}

.stat-label {
  font-size: 13px;
  color: #6c757d;
  margin: 0 0 4px 0;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #2c3e50;
  margin: 0;
}

.cantidad-seleccionada {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f0f4ff;
  color: #509AF8;
  padding: 10px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  border: 1px solid #d0e0ff;
}

.cantidad-seleccionada i {
  font-size: 16px;
}

.cantidad-seleccionada span {
  letter-spacing: 0.3px;
  color: #5a6c7d;
}

.cantidad-seleccionada b {
  color: #509AF8;
}
</style>
