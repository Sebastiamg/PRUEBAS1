<template>
    <div>
        <vs-collapse accordion >
            <vs-collapse-item>
                <div class="text-center font-bold" slot="header" @click="mostrarConfiguracion = true;">
                    CONFIGURACIÓN
                </div>
                <!-- Porcentaje de pedido -->
                <div class="flex justify-center">
                    <div style="width: 50%!important;">
                    <vx-input-group class="mb-base" style="background-color: red;">
                    <template slot="prepend">
                        <div class="prepend-text bg-primary">
                        <span>Porcentaje de pedidos %</span>
                        </div>
                    </template>
                    <vs-input v-model="porcentaje_pedido" @keyUp.enter="savePorcentaPedido()" @blur="savePorcentaPedido()"/>
                    </vx-input-group>
                    </div>
                </div>
                <vs-divider style="margin-top: -10px;"></vs-divider>
                <!-- /Porcentaje de pedido -->
                <!--SERIES BASICAS-->
                <seriesBasicasVue v-if="mostrarConfiguracion" :id_periodo="id_periodo"/>
            </vs-collapse-item>
        </vs-collapse>
        <div align="center">
        <div class="alerta_formato">
            <b>
            Si no ingresa almenos un valor para una serie, esta no se mostrará en el formulario del asesor. <br>
            Únicamente los niveles que seleccione podran ser utilizados por los asesores.
            </b>
        </div>
        </div>
        <vs-collapse>
        <vs-collapse-item :key="index" v-for="(item, index) in arregloSeries">
            <div slot="header" class="text-center"> <b>{{item.nombre_serie.toUpperCase()}}</b> </div>
            <div class="w-full">
            <div class="vx-row">
                <div :key="indexar" v-for="(itemar, indexar) in item.areas" class="vx-col md:w-1/6 w-full mb-base p-2" align="center">
                    <div class="w-full card_pvp">
                        <div class="w-full mb-3"><b>{{'PVP - ' + itemar.nombrearea}}</b></div>
                        <input type="number" placeholder="0.00" :id="'pvp_'+item.id_serie+'_'+itemar.idarea" @blur="guardar_pvp(item.id_serie, itemar.idarea, 0)" class="input_pvp mb-4"/> USD <br>
                        <vs-divider style="margin: 0%;">Niveles</vs-divider>
                        <div class="w-full" align="center">
                            <div :key="indexck" v-for="(itemck, indexck) in 10" style="width: 20px; margin: 1px; display: inline-block;">
                            <input type="checkbox" class="checks_lvl" :id="'lvl_'+item.id_serie+'_'+itemar.idarea+'_'+indexck" :name="'lvl_'+item.id_serie+'_'+itemar.idarea+'_'+indexck" @input="save_nivel_area(item.id_serie, itemar.idarea, indexck, 0)"/>
                            <label :for="'lvl_'+'_'+item.id_serie+'_'+itemar.idarea+'_'+indexck"> {{indexck+1}} </label>
                            </div>
                        </div>
                        <vs-divider style="margin: 0%;">Orden</vs-divider>
                        <input type="number" placeholder="0" :id="'orden_'+item.id_serie+'_'+itemar.idarea" @blur="guardar_pvp(item.id_serie, itemar.idarea, 0)" class="input_pvp mb-4"/>
                    </div>
                </div>
            </div>
            </div>
        </vs-collapse-item>
        <vs-collapse-item>
            <div slot="header" class="text-center"> <b>PLAN LECTOR</b> </div>
            <div class="w-full">
            <vs-table pagination max-items="5" search :data="series_plan_lector">
                <template slot="thead">
                <vs-th>#</vs-th>
                <vs-th sort-key="nombrelibro">Nombre libro</vs-th>
                <vs-th><div class="w-full text-center"></div></vs-th>
                </template>
                <template slot-scope="{data}">
                <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td> {{ indextr+1 }} </vs-td>
                    <vs-td :data="tr.nombrelibro">
                    <b>{{tr.nombrelibro}}</b>
                    </vs-td>
                    <vs-td>
                    <input class="input_pvp" style="width: 100px;" type="number" placeholder="0.00" :id="'pvp_6_'+tr.idlibro" :value="tr.pvp" @blur="guardar_pvp(6, 69, tr.idlibro)" /> USD
                    </vs-td>
                </vs-tr>
                </template>
            </vs-table>
            </div>
        </vs-collapse-item>
        </vs-collapse>
    </div>
</template>
<script>
import seriesBasicasVue from '../seriesBasicas.vue'
export default{
    components:{
        seriesBasicasVue,
    },
    data(){
        return{
            usuario:[],
            pvp_areas:[],
            datos:[],
            series_plan_lector:[],
            porcentaje_pedido:0,
            id_periodo:0,
            mostrarConfiguracion:false,
        }
    },
    props:{
        enviarPeriodo:{
            type:Object,
            default:{},
        },
        arregloSeries:{
            type:Array,
            default:[],
        },
    },
    created(){
        let me = this;
        me.usuario = JSON.parse(localStorage.getItem("usuario"))
    },
    mounted(){
        let me = this;
        me.start()
    },
    methods:{
        start(){
            let me  = this;
            let item =              me.enviarPeriodo
            me.porcentaje_pedido    = item.porcentaje_descuento
            me.pvp_areas            = [];
            me.limpiar_inputs()
            me.generarAreasBasicaxPeriodo(item.idperiodoescolar)
            me.id_periodo           = item.idperiodoescolar
            me.get_pvp_periodo(item.idperiodoescolar)
            me.getLibrosPlanLector(item.idperiodoescolar) /// plan lector
        },
        //para guardar el pocentaje de anticipo
        savePorcentaPedido(){
            let me = this;
            this.$http.get(this.$server_url+'changePorcentajeAnticipo?id_periodo='+me.id_periodo+'&porcentaje_pedido='+me.porcentaje_pedido)
            .then(res => {
            me.$vs.notify({
            text:'Se guardo correctamente el porcentaje',
            color:'primary',
            iconPack: 'feather',
            icon:'icon-check'})
            })
        },
        getLibrosPlanLector(id_periodo){
            let me = this
            this.$http.get(this.$server_url+'get_libros_plan_pedido/6/'+id_periodo)
            .then(res => {
                me.series_plan_lector = res.data
            })
        },
        limpiar_inputs(){
            var list_inputs = document.getElementsByClassName('input_pvp');
            for (var n = 0; n < list_inputs.length; n++) {
                document.getElementsByClassName('input_pvp')[n].value = '';
            }
            var list_checks = document.getElementsByClassName('checks_lvl');
            for (var n = 0; n < list_checks.length; n++) {
                document.getElementsByClassName('checks_lvl')[n].checked = false;
            }
        },
        generarAreasBasicaxPeriodo(periodo){
            let me = this
            this.$http.get(this.$server_url+'generarSeriesBasicasPeriodo?periodo_id='+periodo)
            .then(function (res) {
            })
            .catch(function (error) {
                console.log(error + ' error');
            })
        },
        get_pvp_periodo(id_periodo){
            let me = this
            me.$vs.loading();
            this.$http.get(this.$server_url+'series_formato_periodo/'+ id_periodo)
            .then(res => {
                me.$vs.loading.close();
                $.each(res.data, function(key, value1){
                $.each(value1.areas, function(key_ar, value_ar){
                    // carga pvp por areas
                    try {
                    document.getElementById('pvp_'+value1.id_serie+'_'+value_ar.idarea).value = value_ar.pvp
                    document.getElementById('orden_'+value1.id_serie+'_'+value_ar.idarea).value = value_ar.orden
                    } catch (error) {
                    console.log(error +'  '+value_ar.idarea)
                    }
                    // carga de niveles seleccionados por area
                    for( var i=0; i<10; i++){
                    var st_nivel = true
                    if( eval('value_ar.n'+(i+1)) == 'false' || eval('value_ar.n'+(i+1)) == null || eval('value_ar.n'+(i+1)) == 'null' || eval('value_ar.n'+(i+1)) == '' ){
                        st_nivel = false
                    }
                    try {
                        document.getElementById('lvl_'+value1.id_serie+'_'+value_ar.idarea+'_'+i).checked = st_nivel
                    } catch (error) {
                        console.log(error+'  '+value_ar.idarea)
                    }
                    }
                })
                })
            })
        },
        async save_nivel_area(id_serie, id_area, index){
            let me = this
            let check = document.getElementById('lvl_'+id_serie+'_'+id_area+'_'+index).checked
            me.$vs.loading();
            let formData = new FormData();
                formData.append('id_periodo', me.id_periodo);
                formData.append('id_serie', id_serie);
                formData.append('id_area', id_area);
                formData.append('index', index+1);
                if(check == true){
                formData.append('check', '0');
                }
                // formData.append('check', check);
            await this.$http.post(this.$server_url+'save_niveles_area_formato', formData)
            .then(res => {
                me.$vs.loading.close();
                if(res.data.status == '0'){
                me.$vs.notify({ text: res.data.message, color: 'danger', iconPack: 'feather', icon: 'icon-check', time:8000 })
                me.ver_pedido(me.datos)
                // me.getSeries()
                return
                }
                me.$vs.notify({ text: 'Guardado correctamente', color: 'success', iconPack: 'feather', icon: 'icon-check' })
            })
        },
        guardar_pvp(id_serie, id_area, id_libro){
        let me = this
        let pvp_save = ''
        var orden = 0
        if( id_libro == 0 ){
          orden = document.getElementById('orden_'+id_serie+'_'+id_area).value
          pvp_save = document.getElementById('pvp_'+id_serie+'_'+id_area).value
        }else{
          pvp_save = document.getElementById('pvp_6_'+id_libro).value
        }
        if( pvp_save == ''){
          if(orden > 0){
            me.$vs.notify({
              text:'Debe colocar el valor para actualizar el orden',
              color:'warning',
              iconPack: 'feather',
              icon:'icon-check'})
              document.getElementById('orden_'+id_serie+'_'+id_area).value = 0
            return
          }
          return;
        }
        me.$vs.loading();
        let formData = new FormData();
        formData.append('id_periodo', me.id_periodo);
        formData.append('id_serie',   id_serie);
        formData.append('id_area',    id_area);
        formData.append('id_libro',   id_libro);
        formData.append('pvp',        pvp_save);
        formData.append('orden',      orden)
        this.$http.post(this.$server_url+'save_pvp_area_formato', formData)
        .then(res => {
          me.$vs.loading.close();
          if( res.data.length > 0 && id_serie != 6 ){ // PLAN LECTOR NO TIENE NIVELES
            for( var i=0; i<10; i++){ // para refrescar checks de niveles
              var st_nivel = true // invertimos valor
              if( eval('res.data[0].n'+(i+1)) == 'false' || eval('res.data[0].n'+(i+1)) == null || eval('res.data[0].n'+(i+1)) == 'null'  || eval('res.data[0].n'+(i+1)) == '' ){
                st_nivel = false
              }
              document.getElementById('lvl_'+id_serie+'_'+id_area+'_'+i).checked = st_nivel
            }
          }
          me.getLibrosPlanLector(me.id_periodo)
          me.$vs.notify({ text: 'Guardado correctamente', color: 'success', iconPack: 'feather', icon: 'icon-check' })
        })
      },
    }
}
</script>
<style>
.label_inputs{
  font-size: 12px;
  color: rgb(143, 143, 143);
  margin-top: 4px;
  padding-left: 4px;
}

.alerta_formato{
  font-size: 15px;
  background-color: rgb(255, 222, 195);
  color: rgba(255, 132, 0, 0.867);
  padding: 8px;
  border-radius: 7px;
  width: 90%;
  min-width: 350px;
}

.card_pvp{
  border-radius: 10px;
  padding: 10px 5px 10px 5px;
  background-color: rgba(235, 242, 255, 0.59);
}

input[type=number].input_pvp::-webkit-inner-spin-button,
input[type=number].input_pvp::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
    }
input[type=number].input_pvp { -moz-appearance:textfield; }

input[type=number].input_pvp {
  font-size: 18px !important;
  text-align: center;
  color: rgb(60, 108, 192);
  border-radius: 5px;
  border: 2px solid rgb(183, 183, 183);
  width: 100%;
}
</style>
