<template>
    <div>
        <vs-collapse accordion >
            <vs-collapse-item>
                <div slot="header">
                    <b>VER DETALLE CONVENIO</b> 
                </div>
                <div class="flex" v-if="mostrarValores.length > 0">
                    <vs-chip transparent color="warning">Total Doc. Liquidación ${{ filtrarDecimal(totalLiquidacion) }}</vs-chip>
                    <vs-chip transparent color="dark">Total Doc. Anticipos ${{ filtrarDecimal(totalDocAnticipos) }}</vs-chip>
                    <vs-chip transparent color="success">Total Convenio ${{ filtrarDecimal(totalConvenio) }}</vs-chip>
                </div>
                <ul class="mb-1 mt-2" v-if="mostrarValores.length > 0">
                    <li v-for="(item,key) in mostrarValores" :key="key" >
                        <span>
                            <span class="inline-block h-3 w-3 rounded-full mr-2 bg-warning"></span>
                            <span class="font-semibold">
                                {{ item.contrato }}
                            </span><br>
                            <b class="text-warning">Doc. Anticipos</b>
                            <div v-for="(tr,key2) in item.datos">
                                <div>
                                    <p>Doc. Numero: <b>{{ tr.docNumero }}</b></p> 
                                    <p>Doc. Nombre   <b>{{ tr.docNombre }} </b></p> 
                                    <p>Doc. Cuenta   <b>{{ tr.docCuenta }}  </b></p> 
                                    <p>Tipo Documento: <b>{{ tr.docCi }}</b></p> 
                                    <p>Valor: <b>$ {{ tr.docValor }}</b></p> 
                                </div>
                            </div>
                            <b class="text-warning">Doc Liquidación</b>
                            <div v-for="(tr,key2) in item.datos2">
                                <div>
                                    <p>Doc. Numero: <b>{{ tr.docNumero }}</b></p> 
                                    <p>Doc. Nombre   <b>{{ tr.docNombre }} </b></p> 
                                    <p>Doc. Cuenta   <b>{{ tr.docCuenta }}  </b></p> 
                                    <p>Tipo Documento: <b>{{ tr.docCi }}</b></p> 
                                    <p>Valor: <b>$ {{ tr.docValor }}</b></p> 
                                </div>
                            </div>
                        </span>
                        <vs-divider></vs-divider>
                    </li>
                </ul>
                <div v-else>
                    <vs-alert title="Mensaje" color="rgb(231, 154, 23)" active="true">
                        No existe detalles aún del convenio
                    </vs-alert>   
                </div>
           </vs-collapse-item>
        </vs-collapse>
    </div>
</template>
<script>
export default{
    data(){
        return{
            mostrarValores:[],
            totalConvenio:0,
            totalDocAnticipos:0,
        }
    },
    mounted(){
        let me = this
    },
    computed:{
        totalLiquidacion(){
            let me = this;
            if(me.mostrarValores.length >0){
                //total liquidacion
                let datos = me.mostrarValores.filter(p => p.liquidacion)
                let total = datos.reduce((a, b) => a + Math.abs((b["liquidacion"] || 0)), 0);
                //total anticipos
                let datos2 = me.mostrarValores.filter(p => p.totalAnticipos)
                let total2 = datos2.reduce((a, b) => a + Math.abs((b["totalAnticipos"] || 0)), 0);
                me.totalDocAnticipos = total2
                //total convenio
                me.totalConvenio = me.convenio.anticipo_global - Math.abs(total2)
                return total
            }
        }
    },
    watch:{
        arregloHijosConvenio(results){
            let me = this;
            me.renderhijos(me.arregloHijosConvenio)
        }
    },
    props:{
        arregloHijosConvenio:{
            type:Array,
            default:[]
        },
        convenio:{
            type:Object,
            default:{}
        },
    },
    methods:{
        filtrarDecimal(numero){
            let me = this
            if(numero == 0){
                return numero
            }else{
                const transformar = (numero).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
                return transformar
            }
        },
        renderhijos(tr){
            let me = this;
            me.mostrarValores = []
            tr.forEach(element => {
                var cal = new Object();
                cal.id                          = element.id
                cal.pedido_convenio_institucion = element.pedido_convenio_institucion
                cal.contrato                    = element.contrato
                cal.estado                      = element.estado
                cal.created_at                  = element.created_at
                cal.datos                       = element.datos.filter(p => p.docCi == 'ANT')
                cal.datos2                      = element.datos.filter(p => p.docCi == 'LIQ')
                let array                       = element.datos.filter(p => p.docCi == 'LIQ')
                let array2                      = element.datos.filter(p => p.docCi == 'ANT')
                cal.liquidacion = array.reduce((a, b) => parseFloat(a) + parseFloat((b["docValor"] || 0)), 0);
                cal.totalAnticipos              = array2.reduce((a, b) => parseFloat(a) + parseFloat((b["docValor"] || 0)), 0);
                me.mostrarValores.push(cal)
            });
        }
    }
}
</script>