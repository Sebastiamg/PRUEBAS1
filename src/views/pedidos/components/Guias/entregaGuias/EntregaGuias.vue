<template>
    <div>
      <vs-alert color="success" class="mt-3">
          <p><b>Stock de guias</b> (! Seleccione una institucion y la cantidad de libros a dar)</p>
      </vs-alert>
      <div>
          <TableSelectInstitucionVue @change="changeHandle" class="mt-2"/>
      </div>
      <!--CONTADOR SELECCIONADOA-->
      <div class="boton1" style="margin-top: -25px;">
        <div class="info__icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" viewBox="0 0 24 24" height="24" fill="none"><path fill="#393a37" d="m12 1.5c-5.79844 0-10.5 4.70156-10.5 10.5 0 5.7984 4.70156 10.5 10.5 10.5 5.7984 0 10.5-4.7016 10.5-10.5 0-5.79844-4.7016-10.5-10.5-10.5zm.75 15.5625c0 .1031-.0844.1875-.1875.1875h-1.125c-.1031 0-.1875-.0844-.1875-.1875v-6.375c0-.1031.0844-.1875.1875-.1875h1.125c.1031 0 .1875.0844.1875.1875zm-.75-8.0625c-.2944-.00601-.5747-.12718-.7808-.3375-.206-.21032-.3215-.49305-.3215-.7875s.1155-.57718.3215-.7875c.2061-.21032.4864-.33149.7808-.3375.2944.00601.5747.12718.7808.3375.206.21032.3215.49305.3215.7875s-.1155.57718-.3215.7875c-.2061.21032-.4864.33149-.7808.3375z"></path></svg>
        </div>
        <div class="info__title">Cantidad Seleccionada: <b>{{ sumaSeleccionado }}</b></div>
        <!-- <div class="info__close"><svg height="20" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg"><path d="m15.8333 5.34166-1.175-1.175-4.6583 4.65834-4.65833-4.65834-1.175 1.175 4.65833 4.65834-4.65833 4.6583 1.175 1.175 4.65833-4.6583 4.6583 4.6583 1.175-1.175-4.6583-4.6583z" fill="#393a37"></path></svg></div> -->
      </div>
      <br>
      <vs-table max-items="10" search pagination :data="arregloStock">
          <template slot="header">
              <vs-chip  color="primary">Cantidad: <b> {{ arregloStock.length }}</b></vs-chip>
          </template>
          <template slot="thead">
              <vs-th>Código</vs-th>
              <vs-th>Libro</vs-th>
              <vs-th>Stock</vs-th>
              <vs-th>Cantidad</vs-th>
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
                      {{data[indextr].pro_stock}}<br>
                  </vs-td>
                  <vs-td>
                      <vs-input type="number" min="1" v-if="tr.pro_stock > 0" :max="tr.pro_stock" @input="statusButton()" @blur="revisarCantidad(tr)" label-placeholder="Ingrese la cantidad a enviar" v-model="tr.formato"/>
                      <p v-else class="text-danger">No existe stock</p>
                  </vs-td>
              </vs-tr>
          </template>
      </vs-table>
      <div style="margin-top: -35px;">
          <vs-button v-if="buton" @click="openConfirm()" color="success" icon="save" type="relief">Guardar</vs-button>
      </div>
      <br><br><br><br><br><br>
    </div>
</template>
<script>
import TableSelectInstitucionVue from '../../../../usuarios/GestionEstudiantes/components/TableSelectInstitucion.vue';
export default{
    data(){
        return{
            usuario:[],
            arregloStock:[],
            institucion_id:0,
            nombreInstitucion:'',
            error:false,
            statusPeriodo:0,
            periodo_id:0,
            buton:false,
        }
    },
    created(){
        let me = this;
        me.usuario = JSON.parse(localStorage.getItem("usuario"))
    },
    mounted(){
        let me = this;
        me.getStock()
    },
    components:{
        TableSelectInstitucionVue,
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
    },
    methods:{
        getStock() {
            let me = this;
            me.$vs.loading();
            this.$http.get(this.$server_url+'getStockProlipa?asesor_id='+me.usuario.idusuario)
                .then(function (res) {
                    me.arregloStock = res.data
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()
                })
        },
        changeHandle(e){
            let me = this
            let valor = e.change
            if(valor == 'institucion')          me.institucion_id    = e.value
            if(valor == 'nombreInstitucion')    me.nombreInstitucion = e.value
            if(valor == 'noPeriodo')            me.error             = e.value
            if(valor == 'periodo')              me.statusPeriodo     = e.value
            if(valor == 'periodo_id')           me.periodo_id        = e.value
            me.changeInstitucion = false
        },
        revisarCantidad(tr){
            let me = this;
            if( (tr.formato > tr.pro_stock) || (tr.formato < 0 || tr.formato == 0  ) ){
                me.$vs.notify({
                text:'Stock insuficiente o valor inferior a 1',
                color:'danger',
                iconPack: 'feather',
                icon:'icon-check'})
                let datos = me.arregloStock
                me.arregloStock = []
                datos.forEach(element => {
                    var cal = new Object();
                    cal.id = element.id
                    cal.asesor_id   = element.asesor_id
                    cal.pro_codigo  = element.pro_codigo
                    cal.pro_stock   = element.pro_stock
                    if(element.id == tr.id){
                        cal.formato = ""
                    }else{
                        cal.formato = element.formato
                    }
                    cal.created_at = element.created_at
                    cal.nombrelibro = element.nombrelibro
                    me.arregloStock.push(cal)
                });
                return
            }
            me.buton = true
        },
        openConfirm(){
            let me = this
            this.$vs.dialog({
                type:'confirm',
                color: 'danger',
                acceptText:'aceptar',
                cancelText:'cancelar',
                title: `Confirmar`,
                text: 'Estas seguro de entregas las guias a '+me.nombreInstitucion,
                accept:this.guardarStock
            })
        },
        guardarStock(){
            let me = this;
            if(me.error){
                me.$vs.notify({
                text:'La institucion no tiene periodo',
                color:'warning',
                iconPack: 'feather',
                icon:'icon-check'})
                return false;
            }
            if(me.institucion_id <= 0){
                me.$vs.notify({
                text:'Seleccione una institución por favor',
                color:'warning',
                iconPack: 'feather',
                icon:'icon-check'})
                return false
            }
            if(me.statusPeriodo == 0){
                me.$vs.notify({
                text:'La institución tiene período inactivo, consulte con el administrador por favor',
                color:'warning',
                iconPack: 'feather',
                icon:'icon-check'})
                return false
            }
            //setear valores nulos
            var setValores = []
            setValores = me.arregloStock.filter(p => p.formato !=null)
            let formData = new FormData();
            formData.append('institucion_id',       me.institucion_id);
            formData.append('periodo_id',           me.periodo_id);
            formData.append('asesor_id',            me.usuario.idusuario);
            formData.append('data_detalle',         JSON.stringify(setValores))
            //tipo 1 = resta; 0 = suma
            formData.append('tipo',                 1)
            me.$vs.loading()
            this.$http.post(this.$server_url+'PedidoGuiaEntregas', formData)
            .then(res => {
                me.$vs.loading.close()
                me.$vs.notify({
                    text:res.data.message,
                    color:'success',
                    iconPack: 'feather',
                    icon:'icon-check'
                })
                me.getStock()
                me.buton = false
            })
            .catch((e) => {
                me.$vs.loading.close()
            })
        },
        statusButton(){
            let me = this;
            me.buton = false
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

</style>
