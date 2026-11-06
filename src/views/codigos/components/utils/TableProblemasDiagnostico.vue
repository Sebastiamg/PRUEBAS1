<template>
    <div>
        <vs-table :max-items="items" search pagination :data="arregloProblemasDiagnostico">
            <template slot="header">
                <vs-chip  color="primary">Cantidad: <b> {{ arregloProblemasDiagnostico.length }}</b></vs-chip>
            </template>
            <template slot="thead">
                <vs-th v-if="onlyCodes == 1">Código</vs-th>
                <vs-th v-if="onlyCodes == 0">Código de activación</vs-th>
                <vs-th v-if="onlyCodes == 0">Codigo diágnostico</vs-th>
                <vs-th v-if="onlyCodes == 0">Problema</vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                  <vs-td v-if="onlyCodes == 1">
                    {{ tr.codigo }}
                  </vs-td>
                    <vs-td v-if="onlyCodes == 0">
                      {{ tr.codigo }}
                        {{data[indextr].codigoActivacion}}<br>
                    </vs-td>
                    <vs-td v-if="onlyCodes == 0">
                        {{data[indextr].codigoDiagnostico}}<br>
                    </vs-td>
                    <vs-td v-if="onlyCodes == 0">
                      <vs-chip v-if="tr.problema == 'activacion'" color="warning">Problema código activación</vs-chip>
                      <vs-chip v-if="tr.problema == 'diagnostico'" color="danger">Problema código diágnostico</vs-chip>
                      <vs-chip v-if="tr.problema == 'formato'" color="danger">Formato incorrecto</vs-chip>
                      <div v-if="tr.codigoNoExiste">
                          <vs-chip v-if="tr.codigoNoExiste == 'activacion'" color="warning">Problema código activación</vs-chip>
                          <vs-chip v-if="tr.codigoNoExiste == 'diagnostico'" color="danger">Problema código diágnostico</vs-chip>
                          <vs-chip v-if="tr.codigoNoExiste == 'ambos'" color="#202DCB">Ambos códigos no existen</vs-chip>
                      </div>
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>
    </div>
</template>
<script>
export default{
    data(){
        return{

        }
    },
    props:{
        items:{
            type:Number,
            default:0
        },
        arregloProblemasDiagnostico:{
            type:Array,
            default:[]
        },
        onlyCodes:{
          type:Number,
          default:0
        }
    }
}
</script>
